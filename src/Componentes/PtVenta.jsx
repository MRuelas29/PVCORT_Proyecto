export default function PtVenta({ onLogout }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>PV COTIACERO</h2>
        <button>Nueva Venta</button>
        <button>Inventario</button>
        <button>Clientes</button>
        <button>Reportes</button>
        <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
      </aside>

      <main className="content">
        <h1>Panel de Control</h1>
        <div className="stats">
          <div className="card">Ventas del día: <strong>$0.00</strong></div>
          <div className="card">Productos bajos en stock: <strong>0</strong></div>
        </div>
      </main>
    </div>
  );
}