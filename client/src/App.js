import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaPaw, FaUser, FaDog } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

// Páginas
import Home from "./pages/Home";
import Empleados from "./pages/Empleados";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Solicitud from "./pages/Solicitud";
import FormCatalogo from "./pages/FormCatalogo";
import FormMascPerdida from "./pages/FormMascPerdida";
import PanelEmpleados from "./pages/PanelEmpleados";
import ExpedienteClinico from "./pages/ExpedienteClinico";


function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Router>
        {/* ==========================
            NAVBAR
        =========================== */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            {/* Marca con huella */}
            <NavLink className="navbar-brand d-flex align-items-center" to="/">
              <FaPaw color="#4f46e5" style={{ marginRight: "8px" }} />
              CEMCAA
            </NavLink>

            {/* Botón colapsable (móvil) */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Enlaces */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Home
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/empleados"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Empleados
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/catalogo"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Catálogo
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/expediente-clinico"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    ExpedienteClinico
                  </NavLink>
                </li>

                {/* 🐾 Nuevo enlace: Mascotas Perdidas */}
                <li className="nav-item">
                  <NavLink
                    to="/form-mascota-perdida"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Mascotas Perdidas
                  </NavLink>
                </li>

                {/* Solicitud de adopción */}
                <li className="nav-item">
                  <NavLink
                    to="/solicitud"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active d-flex align-items-center"
                        : "nav-link d-flex align-items-center"
                    }
                  >
                    <FaDog style={{ marginRight: "5px" }} />
                    Solicitud
                  </NavLink>
                </li>

                {/* Panel de empleados */}
                <li className="nav-item">
                  <NavLink
                    to="/panel-empleados"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active d-flex align-items-center"
                        : "nav-link d-flex align-items-center"
                    }
                  >
                    <FaDog style={{ marginRight: "5px" }} />
                    Panel de Empleados
                  </NavLink>
                </li>

                {/* Login */}
                <li className="nav-item">
                  <NavLink
                    to="/panel-empleados"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active d-flex align-items-center"
                        : "nav-link d-flex align-items-center"
                    }
                  >
                    <FaUser style={{ marginRight: "5px" }} />
                    Login
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* ==========================
            CONTENIDO PRINCIPAL
        =========================== */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/form-catalogo" element={<FormCatalogo />} />
            <Route path="/form-catalogo/:id" element={<FormCatalogo />} />
            <Route path="/form-mascota-perdida" element={<FormMascPerdida />} />
            <Route path="/login" element={<Login />} />
            <Route path="/solicitud" element={<Solicitud />} />
            <Route path="/panel-empleados" element={<PanelEmpleados />} />
            <Route path="/expediente-clinico" element={<ExpedienteClinico />} />
          </Routes>
        </main>

        {/* ==========================
            FOOTER FIJO ABAJO
        =========================== */}
        <footer className="app-footer mt-auto">
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
            <div className="text-center text-md-start mb-2 mb-md-0 d-flex align-items-center justify-content-center">
              <FaPaw color="#4f46e5" style={{ marginRight: "8px" }} />
              <strong>CEMCAA © {new Date().getFullYear()}</strong>&nbsp;— Centro de Mascotas y Adopciones.
            </div>

            <div className="text-center text-md-end">
              <a href="mailto:contacto@cemcaa.org" className="footer-link">
                contacto@cemcaa.org
              </a>{" "}
              |
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link ms-2"
              >
                Facebook
              </a>{" "}
              |
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link ms-2"
              >
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
