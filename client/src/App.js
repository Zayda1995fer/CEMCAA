import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaPaw, FaUser, FaDog } from "react-icons/fa"; // Huella, usuario y perro
import 'bootstrap/dist/css/bootstrap.min.css';

// Páginas
import Home from "./pages/Home";
import Empleados from "./pages/Empleados";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Solicitud from "./pages/Solicitud"; // Nueva página

function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          {/* Brand con huella */}
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <FaPaw color="black" style={{ marginRight: "8px" }} />
            CEMCAA
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/empleados"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Empleados
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/catalogo"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Catálogo
                </NavLink>
              </li>
              {/* Solicitud de adopción */}
              <li className="nav-item">
                <NavLink
                  to="/solicitud"
                  className={({ isActive }) => (isActive ? "nav-link active d-flex align-items-center" : "nav-link d-flex align-items-center")}
                >
                  <FaDog style={{ marginRight: "5px" }} />
                  Solicitud
                </NavLink>
              </li>
              {/* Botón de login */}
              <li className="nav-item">
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "nav-link active d-flex align-items-center" : "nav-link d-flex align-items-center")}
                >
                  <FaUser style={{ marginRight: "5px" }} />
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/solicitud" element={<Solicitud />} /> {/* Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
