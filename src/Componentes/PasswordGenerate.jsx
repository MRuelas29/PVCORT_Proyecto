import React, { useState, useEffect, useRef } from "react";
 
export default function PasswordGeneerator() {
  const [passwords, setPasswords] = useState([]);
  const [showPasswords, setShowPasswords] = useState(false);
  const workerRef = useRef(null); 
 
  useEffect(() => {
    const pwWorker = new Worker(
      new URL("./PasswordWorker.js", import.meta.url)
    );
    pwWorker.onmessage = (e) => {
      setPasswords(e.data);  
    };
    workerRef.current = pwWorker;  
 
    return () => pwWorker.terminate();
  }, []);
 
  const generatePasswords = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ length: 12, quantity: 5 });
    }
  };
 
  return (
    <div style={{ padding: "20px" }}>
      <h2>Generador de Contraseñas</h2>
      <button onClick={generatePasswords}>Generar Contraseña</button>
      <label style={{ marginLeft: "10px" }}>
        <input
          type="checkbox"
          checked={showPasswords}
          onChange={() => setShowPasswords(!showPasswords)}
        />{" "}
        Mostrar contraseñas
      </label>
      <ul>
        {passwords.map((pw, idx) => (
          <li key={idx}>{showPasswords ? pw : "*".repeat(pw.length)}</li>
        ))}
      </ul>
    </div>
  );
}