import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaPaw, FaDog, FaBars, FaTimes, FaUsers, FaClipboardList, FaTasks, FaSignOutAlt, FaPlusCircle, FaExclamationTriangle,FaEnvelopeOpenText,} from "react-icons/fa";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

// Páginas
import Home from "./pages/Home";
import Empleados from "./pages/Empleados";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Auth from "./pages/Login";
import Solicitud from "./pages/Solicitud";
import FormCatalogo from "./pages/FormCatalogo";
import FormMascPerdida from "./pages/FormMascPerdida";
import PanelEmpleados from "./pages/PanelEmpleados";
import ReportarAvistamiento from "./pages/ReportarAvistamiento";
import SolicitudCompleta from "./pages/SolicitudCompleta";
import Expediente from "./pages/Expediente";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setIsOpen(false);
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Router>
        {/* ==========================
            HEADER PRINCIPAL
        =========================== */}
        <header className="bg-dark text-light p-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaPaw color="#4f46e5" className="me-2" />
            <h4 className="m-0">CEMCAA</h4>
          </div>
          <nav>
            <NavLink to="/" className="text-light me-3">
              Home
            </NavLink>
            {!user && (
              <NavLink to="/auth" className="text-light">
                Login / Registro
              </NavLink>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm ms-3"
              >
                <FaSignOutAlt className="me-1" /> Cerrar sesión
              </button>
            )}
          </nav>
        </header>

        {/* ==========================
            BOTÓN DE MENÚ (MÓVIL)
        =========================== */}
        {user && (
          <button
            className="menu-toggle btn btn-dark"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}

        {/* ==========================
            SIDEBAR
        =========================== */}
        {user && (
          <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <ul className="nav flex-column mt-4">
              {user.tipo === "empleado" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/empleados"
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUsers className="me-2" /> Empleados
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/solicitudes-empleado"
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaEnvelopeOpenText className="me-2" /> Solicitudes
                    </NavLink>
                  </li>

                                    <li className="nav-item">
                    <NavLink
                      to="/expediente"
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaEnvelopeOpenText className="me-2" /> Expedientes
                    </NavLink>
                  </li>


                  <li className="nav-item">
                    <NavLink
                      to="/panel-empleados"
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTasks className="me-2" /> Panel de Empleados
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/form-catalogo"
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaPlusCircle className="me-2" /> Agregar Mascota
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/form-mascota-perdida"
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaExclamationTriangle className="me-2" /> Publicar Mascota Perdida
                    </NavLink>
                  </li>
                </>
              )}

              {["usuario", "empleado"].includes(user.tipo) && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/catalogo"
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaClipboardList className="me-2" /> Catálogo
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/form-mascota-perdida"
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaExclamationTriangle className="me-2" /> Publicar Mascota Perdida
                    </NavLink>
                  </li>

                  {user.tipo === "usuario" && (
                    <li className="nav-item">
                      <NavLink
                        to="/solicitud"
                        className="nav-link"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaDog className="me-2" /> Solicitud
                      </NavLink>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        )}

        {/* ==========================
            CONTENIDO PRINCIPAL
        =========================== */}
        <main className="flex-grow-1 p-3 content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth onLogin={setUser} />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/form-catalogo" element={<FormCatalogo />} />
            <Route path="/form-catalogo/:id" element={<FormCatalogo />} />
            <Route path="/form-mascota-perdida" element={<FormMascPerdida />} />
            <Route path="/solicitud" element={<Solicitud />} />
            <Route path="/panel-empleados" element={<PanelEmpleados />} />
            <Route path="/solicitud-Comp" element={<SolicitudCompleta />} /> {/* ✅ nueva ruta */}
            <Route path="/login" element={<Login />} />
            <Route path="/reportar-avistamiento/:id" element={<ReportarAvistamiento />} />
            <Route path="/expediente" element={<Expediente />} />
          </Routes>
        </main>

        {/* ==========================
            FOOTER
        =========================== */}
        <footer className="app-footer mt-auto bg-dark text-light text-center py-3">
          <FaPaw color="#4f46e5" className="me-2" />
          <strong>CEMCAA © {new Date().getFullYear()}</strong> — Centro de
          Mascotas y Adopciones.
        </footer>
      </Router>
    </div>
  );
}

export default App;
