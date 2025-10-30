import './MesasPage.css';

const MesasPage = () => {
  return (
    <div className="mesas-page">
      <div className="page-header">
        <h1>🍽️ Mesas</h1>
        <p>Gerencie as mesas do restaurante</p>
      </div>

      <div className="mesas-grid">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="mesa-card">
            <div className="mesa-number">Mesa {num}</div>
            <div className="mesa-status disponivel">Disponível</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MesasPage;
