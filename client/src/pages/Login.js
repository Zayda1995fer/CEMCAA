import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import "../App.css";

function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login"); // 'login' o 'registroUsuario'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFin, setHorarioFin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  // Manejo del login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3001/auth/login", { email, password });
      if (res.data.tipo === "usuario") {
        setTipoUsuario("usuario");
        setMensaje(`Bienvenido ${res.data.usuario.nombre_completo} (Usuario)`);
        onLogin({ tipo: "usuario", datos: res.data.usuario });
      } else if (res.data.tipo === "empleado") {
        setTipoUsuario("empleado");
        setMensaje(`Bienvenido ${res.data.usuario.nombre} (Empleado)`);
        onLogin({ tipo: "empleado", datos: res.data.usuario });
      } else {
        setMensaje("Tipo de usuario desconocido.");
        return;
      }
      navigate("/");
    } catch (error) {
      if (error.response?.data?.error) setMensaje(error.response.data.error);
      else setMensaje("Ocurrió un error al iniciar sesión.");
      setTipoUsuario("");
    }
  };

  // Registro de usuario normal
  const handleRegistroUsuario = async (e) => {
    e.preventDefault();
    if (!nombre || !edad || !telefono || !email || !direccion || !ocupacion || !horarioInicio || !horarioFin || !password) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3001/auth/register-usuario", {
        nombre_completo: nombre,
        edad,
        telefono,
        email,
        direccion,
        ocupacion,
        horario_laboral_inicio: horarioInicio,
        horario_laboral_fin: horarioFin,
        password,
      });
      setMensaje(res.data.mensaje);
      setTipoUsuario("usuario");
      onLogin({ tipo: "usuario" });
      setModo("");
      navigate("/"); // redirigir al home
    } catch (error) {
      if (error.response?.data?.error) setMensaje(error.response.data.error);
      else setMensaje("Ocurrió un error al registrar usuario.");
    }
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModo("");
    setMensaje("");
    setEmail("");
    setPassword("");
    setNombre("");
    setEdad("");
    setTelefono("");
    setDireccion("");
    setOcupacion("");
    setHorarioInicio("");
    setHorarioFin("");
    setTipoUsuario("");
  };

  // Abrir modal de registro de usuario desde el enlace
  const abrirRegistroUsuario = () => {
    setModo("registroUsuario");
    setMensaje("");
    setEmail("");
    setPassword("");
    setNombre("");
    setEdad("");
    setTelefono("");
    setDireccion("");
    setOcupacion("");
    setHorarioInicio("");
    setHorarioFin("");
  };

  return (
    <div className="App">
      <main>
        {/* Modal LOGIN o REGISTRO */}
        {(modo === "login" || modo === "registroUsuario") && (
          <div className="modal-overlay">
            <div className="modal-container">
              <button className="btn-cerrar" onClick={cerrarModal}>
                X
              </button>

              {modo === "login" && (
                <form className="datos login-form" onSubmit={handleLogin}>
                  <h2>Iniciar Sesión</h2>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-principal">
                    Ingresar
                  </button>

                  <p style={{ marginTop: "10px" }}>
                    ¿No tienes cuenta?{" "}
                    <span
                      onClick={abrirRegistroUsuario}
                      style={{ color: "#007bff", cursor: "pointer", textDecoration: "none" }}
                    >
                      Regístrate aquí
                    </span>
                  </p>
                </form>
              )}

              {modo === "registroUsuario" && (
                <form className="datos login-form" onSubmit={handleRegistroUsuario}>
                  <h2>Mi Registro</h2>
                  <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                  <input type="number" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} required />
                  <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                  <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                  <input type="text" placeholder="Ocupación" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)} required />
                  <input type="time" placeholder="Horario inicio" value={horarioInicio} onChange={(e) => setHorarioInicio(e.target.value)} required />
                  <input type="time" placeholder="Horario fin" value={horarioFin} onChange={(e) => setHorarioFin(e.target.value)} required />
                  <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="submit" className="btn-principal">
                    Registrar Usuario
                  </button>
                </form>
              )}

              {mensaje && (
                <p className={`mensaje ${tipoUsuario === "usuario" ? "exito" : "error"}`}>
                  {mensaje}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Auth;
