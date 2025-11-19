<?php

namespace App\Http\Controllers;

use App\Models\Mesa;
use Illuminate\Http\Request;

class MesaController extends Controller
{
    /**
     * Listar todas as mesas
     */
    public function index()
    {
        $mesas = Mesa::all();

        return response()->json([
            'mesas' => $mesas,
        ], 200);
    }

    /**
     * Mostrar uma mesa específica
     */
    public function show($id)
    {
        $mesa = Mesa::findOrFail($id);

        return response()->json([
            'mesa' => $mesa,
        ], 200);
    }

    /**
     * Criar nova mesa
     */
    public function store(Request $request)
    {
        $request->validate([
            'numero' => 'required|integer|unique:mesas,numero',
            'status' => 'sometimes|in:disponivel,ocupada,reservada',
            'capacidade' => 'sometimes|integer|min:1',
        ]);

        $mesa = Mesa::create([
            'numero' => $request->numero,
            'status' => $request->status ?? 'disponivel',
            'capacidade' => $request->capacidade ?? 4,
        ]);

        return response()->json([
            'message' => 'Mesa criada com sucesso',
            'mesa' => $mesa,
        ], 201);
    }

    /**
     * Atualizar mesa
     */
    public function update(Request $request, $id)
    {
        $mesa = Mesa::findOrFail($id);

        $request->validate([
            'numero' => 'sometimes|integer|unique:mesas,numero,' . $id,
            'status' => 'sometimes|in:disponivel,ocupada,reservada',
            'capacidade' => 'sometimes|integer|min:1',
        ]);

        if ($request->has('numero')) {
            $mesa->numero = $request->numero;
        }
        if ($request->has('status')) {
            $mesa->status = $request->status;
        }
        if ($request->has('capacidade')) {
            $mesa->capacidade = $request->capacidade;
        }

        $mesa->save();

        return response()->json([
            'message' => 'Mesa atualizada com sucesso',
            'mesa' => $mesa,
        ], 200);
    }

    /**
     * Deletar mesa
     */
    public function destroy($id)
    {
        $mesa = Mesa::findOrFail($id);
        $mesa->delete();

        return response()->json([
            'message' => 'Mesa deletada com sucesso',
        ], 200);
    }
}
