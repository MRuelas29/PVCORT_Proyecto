import React, { useState, useEffect, useRef } from "react";
import "../Estilo/Login.css";

// PIN de administrador para autorizar nuevos registros
const PIN_ADMIN = "4321";

export default function Login({ onLogin }) {
  const [usuarios, setUsuarios] = useState([
    { nombre: "Administrador", clave: "1212" }
  ]);

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [esRegistro, setEsRegistro] = useState(false);
  const [claveGenerada, setClaveGenerada] = useState(false);

  // Estados para el PIN de autorización
  const [mostrarModalPin, setMostrarModalPin] = useState(false);
  const [pinIngresado, setPinIngresado] = useState("");
  const [errorPin, setErrorPin] = useState("");
  const [pinVerificado, setPinVerificado] = useState(false);

  const workerRef = useRef(null);

  useEffect(() => {
    const pwWorker = new Worker(new URL("./PasswordWorker.js", import.meta.url));
    pwWorker.onmessage = (e) => {
      setContrasena(e.data[0]);
      setClaveGenerada(true);
      setError("");
    };
    workerRef.current = pwWorker;
    return () => pwWorker.terminate();
  }, []);

  const solicitarClaveCriptografica = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ length: 10, quantity: 1 });
    }
  };

  const iniciarRegistro = () => {
    setMostrarModalPin(true);
    setPinIngresado("");
    setErrorPin("");
  };

  const verificarPin = () => {
    if (pinIngresado === PIN_ADMIN) {
      setPinVerificado(true);
      setMostrarModalPin(false);
      setEsRegistro(true);
      setPinIngresado("");
      setErrorPin("");
    } else {
      setErrorPin("PIN incorrecto. Acceso denegado.");
      setPinIngresado("");
    }
  };

  const cancelarPin = () => {
    setMostrarModalPin(false);
    setPinIngresado("");
    setErrorPin("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (esRegistro) {
      if (usuarios.some((u) => u.nombre === usuario)) {
        setError("El usuario ya existe.");
        return;
      }
      setUsuarios([...usuarios, { nombre: usuario, clave: contrasena }]);
      alert(`¡Cajero "${usuario}" registrado con éxito!`);
      cancelarRegistro();
    } else {
      const userFound = usuarios.find(
        (u) => u.nombre === usuario && u.clave === contrasena
      );
      if (userFound) {
        onLogin(userFound.nombre);
      } else {
        setError("Usuario o contraseña incorrectos.");
        setContrasena("");
      }
    }
  };

  const cancelarRegistro = () => {
    setEsRegistro(false);
    setPinVerificado(false);
    setUsuario("");
    setContrasena("");
    setError("");
    setClaveGenerada(false);
  };

  return (
    <div className="login-wrapper">

      {/* ── Modal de PIN ── */}
      {mostrarModalPin && (
        <div className="pin-overlay">
          <div className="pin-modal">
            <div className="pin-icon">🔐</div>
            <h3>Autorización Requerida</h3>
            <p>Ingresa el PIN de administrador para registrar un nuevo cajero.</p>
            <input
              type="password"
              maxLength={4}
              placeholder="PIN de 4 dígitos"
              value={pinIngresado}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setPinIngresado(val);
                setErrorPin("");
              }}
              onKeyDown={(e) => e.key === "Enter" && verificarPin()}
              autoFocus
            />
            {errorPin && <p className="login-error">{errorPin}</p>}
            <div className="pin-buttons">
              <button className="form-btn" onClick={verificarPin} disabled={pinIngresado.length !== 4}>
                Verificar
              </button>
              <button className="btn-cancelar" onClick={cancelarPin}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Formulario principal ── */}
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-avatar">👤</div>
        <h2 className="login-title">
          {esRegistro ? "Nuevo Cajero" : "Punto de Venta"}
        </h2>

        <input
          type="text"
          placeholder="Nombre de Usuario"
          required
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="password" // <--- CAMBIADO A PASSWORD
            placeholder="Contraseña"
            required
            value={contrasena}
            readOnly={esRegistro}
            onChange={(e) => setContrasena(e.target.value)}
            style={{ paddingRight: esRegistro ? "45px" : "15px" }}
          />
          {esRegistro && (
            <button
              type="button"
              onClick={solicitarClaveCriptografica}
              title="Generar contraseña segura"
              style={{
                position: "absolute",
                right: "10px",
                top: "12px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              🔄
            </button>
          )}
        </div>

        {error && <p className="login-error">{error}</p>}

        <button
          type="submit"
          className="form-btn"
          disabled={
            esRegistro ? !claveGenerada || !usuario : !usuario || !contrasena
          }
          style={{ opacity: esRegistro && !claveGenerada ? 0.5 : 1 }}
        >
          {esRegistro ? "Registrar Ahora" : "Entrar"}
        </button>

        <p
          className="toggle-auth"
          onClick={esRegistro ? cancelarRegistro : iniciarRegistro}
          style={{
            marginTop: "20px",
            cursor: "pointer",
            color: "#2a5298",
            fontSize: "14px",
          }}
        >
          {esRegistro ? "← Volver al Inicio" : "¿Registrar nuevo cajero?"}
        </p>
      </form>
    </div>
  );
}