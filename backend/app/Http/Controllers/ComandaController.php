<?php

namespace App\Http\Controllers;

use App\Models\Comanda;
use App\Models\ComandaItem;
use App\Models\Mesa;
use App\Models\Produto;
use Illuminate\Http\Request;

class ComandaController extends Controller
{
    /**
     * Buscar comanda ativa de uma mesa ou criar nova
     */
    public function show($mesaId)
    {
        $mesa = Mesa::findOrFail($mesaId);

        // Buscar comanda ativa (aberta ou enviada para cozinha)
        $comanda = Comanda::where('mesa_id', $mesaId)
            ->whereIn('status', ['aberta', 'enviada_cozinha'])
            ->with('items.produto')
            ->first();

        // Se não existe, criar nova comanda
        if (!$comanda) {
            $comanda = Comanda::create([
                'mesa_id' => $mesaId,
                'garcom_id' => auth()->id(),
                'status' => 'aberta',
            ]);
        }

        return response()->json([
            'comanda' => $comanda,
        ], 200);
    }

    /**
     * Criar comanda para uma mesa
     */
    public function store(Request $request, $mesaId)
    {
        $mesa = Mesa::findOrFail($mesaId);

        // Verificar se já existe comanda ativa
        $comanda = Comanda::where('mesa_id', $mesaId)
            ->whereIn('status', ['aberta', 'enviada_cozinha'])
            ->first();

        if ($comanda) {
            return response()->json([
                'message' => 'Mesa já possui uma comanda ativa',
                'comanda' => $comanda,
            ], 200);
        }

        $comanda = Comanda::create([
            'mesa_id' => $mesaId,
            'garcom_id' => auth()->id(),
            'status' => 'aberta',
        ]);

        // Atualizar status da mesa para ocupada
        $mesa->status = 'ocupada';
        $mesa->save();

        return response()->json([
            'message' => 'Comanda criada com sucesso',
            'comanda' => $comanda,
        ], 201);
    }

    /**
     * Adicionar item à comanda
     */
    public function addItem(Request $request, $comandaId)
    {
        $comanda = Comanda::findOrFail($comandaId);

        $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'quantidade' => 'required|integer|min:1',
            'observacoes' => 'nullable|string',
            'preco_unitario' => 'nullable|numeric|min:0',
        ]);

        $produto = Produto::findOrFail($request->produto_id);

        // Usar preço passado ou preço padrão do produto
        $precoUnitario = $request->preco_unitario ?? $produto->preco;

        // SEMPRE criar novo item - NÃO agrupar
        $item = ComandaItem::create([
            'comanda_id' => $comandaId,
            'produto_id' => $request->produto_id,
            'quantidade' => $request->quantidade,
            'preco_unitario' => $precoUnitario,
            'subtotal' => $request->quantidade * $precoUnitario,
            'observacoes' => $request->observacoes,
            'status' => 'pendente',
        ]);

        // Recalcular total da comanda
        $this->calcularTotalComanda($comanda);

        return response()->json([
            'message' => 'Item adicionado com sucesso',
            'item' => $item->load('produto'),
        ], 201);
    }

    /**
     * Remover item da comanda
     */
    public function removeItem($itemId)
    {
        $item = ComandaItem::findOrFail($itemId);
        $comanda = $item->comanda;

        $item->delete();

        // Recalcular total
        $this->calcularTotalComanda($comanda);

        return response()->json([
            'message' => 'Item removido com sucesso',
        ], 200);
    }

    /**
     * Atualizar quantidade de um item
     */
    public function updateItem(Request $request, $itemId)
    {
        $item = ComandaItem::findOrFail($itemId);

        $request->validate([
            'quantidade' => 'required|integer|min:1',
            'observacoes' => 'nullable|string',
        ]);

        $item->quantidade = $request->quantidade;
        $item->subtotal = $request->quantidade * $item->preco_unitario;
        if ($request->has('observacoes')) {
            $item->observacoes = $request->observacoes;
        }
        $item->save();

        // Recalcular total
        $this->calcularTotalComanda($item->comanda);

        return response()->json([
            'message' => 'Item atualizado com sucesso',
            'item' => $item,
        ], 200);
    }

    /**
     * Enviar comanda para a cozinha
     */
    public function enviarCozinha($comandaId)
    {
        $comanda = Comanda::findOrFail($comandaId);

        if ($comanda->status === 'paga') {
            return response()->json([
                'message' => 'Não é possível enviar uma comanda paga para a cozinha',
            ], 400);
        }

        $comanda->status = 'enviada_cozinha';
        $comanda->save();

        // Atualizar status dos itens para preparando
        $comanda->items()->update(['status' => 'preparando']);

        return response()->json([
            'message' => 'Comanda enviada para a cozinha',
            'comanda' => $comanda,
        ], 200);
    }

    /**
     * Fechar comanda (gerar conta)
     */
    public function fechar(Request $request, $comandaId)
    {
        $comanda = Comanda::findOrFail($comandaId);

        $request->validate([
            'desconto' => 'nullable|numeric|min:0',
            'taxa_servico' => 'nullable|numeric|min:0',
        ]);

        if ($request->has('desconto')) {
            $comanda->desconto = $request->desconto;
        }
        if ($request->has('taxa_servico')) {
            $comanda->taxa_servico = $request->taxa_servico;
        }

        $comanda->status = 'finalizada';
        $comanda->fechada_em = now();
        $comanda->save();

        // Atualizar status da mesa para disponível
        $mesa = $comanda->mesa;
        $mesa->status = 'disponivel';
        $mesa->save();

        return response()->json([
            'message' => 'Comanda fechada com sucesso',
            'comanda' => $comanda->load('items.produto'),
        ], 200);
    }

    /**
     * Marcar comanda como paga
     */
    public function marcarPaga($comandaId)
    {
        $comanda = Comanda::findOrFail($comandaId);

        $comanda->status = 'paga';
        $comanda->save();

        return response()->json([
            'message' => 'Comanda marcada como paga',
            'comanda' => $comanda,
        ], 200);
    }

    /**
     * Listar produtos disponíveis
     */
    public function produtos()
    {
        $produtos = Produto::where('disponivel', true)
            ->with('categoria')
            ->get();

        return response()->json([
            'produtos' => $produtos,
        ], 200);
    }
    
    public function adicionais()
    {
        $adicionais = Produto::where('disponivel', true)
            ->whereHas('categoria', function ($query) {
                $query->where('slug', 'adicionais');
            })
            ->with('categoria')
            ->get();

        return response()->json([
            'adicionais' => $adicionais,
        ], 200);
    }
    /**
     * Função auxiliar para calcular total da comanda
     */
    private function calcularTotalComanda(Comanda $comanda)
    {
        $subtotal = $comanda->items()->sum('subtotal');
        $comanda->total = $subtotal - $comanda->desconto + $comanda->taxa_servico;
        $comanda->save();
    }
}
