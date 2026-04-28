import { useState } from "react";
import "./Estilo/Diseño.css";
import "./Estilo/Login.css";
import Login from "./Componentes/Login";
import PtVenta from "./Componentes/PtVenta";
 
function App() {
  const [logueado, setLogueado] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState("");
 
  const handleLogin = (nombreUsuario) => {
    setUsuarioActual(nombreUsuario);
    setLogueado(true);
  };
 
  const handleLogout = () => {
    setUsuarioActual("");
    setLogueado(false);
  };
 
  return (
    <div>
      {logueado ? (
        <PtVenta onLogout={handleLogout} usuario={usuarioActual} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
 
export default App;
 