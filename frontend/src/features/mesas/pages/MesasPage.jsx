import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import Spinner from '../../../components/common/Spinner/Spinner.jsx';
import API_URL from '../../../config/api'
import './MesasPage.css';

const MesasPage = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca mesas da API com URL completa do backend
    fetch(`${API_URL}/mesas`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // console.log('Dados recebidos:', data);
        setMesas(data.mesas || data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar mesas:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleMesaClick = (mesa) => {
    navigate(`/mesas/${mesa.id}/comanda`, { state: { mesa, role: user.role } });
  };

  return (
    <div className="mesas-page">
      <div className="page-header">
        <h1>🍽️ Mesas</h1>
      </div>
      <div className='page-mensage'>
        <p>Visualize o status das mesas e acesse suas comandas.</p>
      </div>
      <div className="mesas-grid" style={{ minHeight: "50vh", position: "relative" }}>
        {loading ? (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Spinner size="large" text="Carregando mesas..." fullScreen={false} />
          </div>
        ) : error ? (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}>
            <p style={{ color: "red" }}>Erro ao carregar mesas: {error}</p>
          </div>
        ) : (
          mesas.map(mesa => (
            <div
              key={mesa.id}
              className="mesa-card"
              onClick={() => handleMesaClick(mesa)}
            >
              <div className="mesa-number">{`Mesa ${mesa.numero}`}</div>
              <div className={`mesa-status ${mesa.status}`}>
                {mesa.status === 'disponivel' ? 'Disponível' : 'Ocupada'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MesasPage;
