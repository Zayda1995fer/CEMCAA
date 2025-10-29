import React, { useEffect, useState } from "react";

export default function ExpedienteClinico() {
  // ==========================
  // 🔧 Estado
  // ==========================
  const [animales, setAnimales] = useState([]);
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [expedientes, setExpedientes] = useState([]); // <- ahora plural (lista)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null); // mensajes informativos (404/no hay datos, etc.)

  // ==========================
  // 🔹 Cargar animales
  // ==========================
  useEffect(() => {
    setError(null);
    setMensaje(null);
    fetch("http://localhost:3001/animales")
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo cargar el catálogo de animales");
        const data = await res.json();
        setAnimales(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.message || "Error al cargar animales"));
  }, []);

  // ==========================
  // 🔹 Cargar expedientes del animal (lista completa)
  // ==========================
  const cargarExpedientes = (idAnimal) => {
    setAnimalSeleccionado(idAnimal);
    setMostrarFormulario(false);
    setExpedientes([]);
    setError(null);
    setMensaje(null);

    fetch(`http://localhost:3001/expediente-medico/expedientes/${idAnimal}`)
      .then(async (res) => {
        if (res.status === 404) {
          // El controller responde 404 cuando no hay expedientes
          setExpedientes([]);
          setMensaje("No hay expedientes registrados para este animal.");
          return [];
        }
        if (!res.ok) throw new Error("No se pudieron cargar los expedientes");
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [];
        setExpedientes(lista);
        if (lista.length === 0) {
          setMensaje("No hay expedientes registrados para este animal.");
        }
        return data;
      })
      .catch((e) => setError(e.message || "Error al cargar expedientes"));
  };

  // ==========================
  // 🩺 Formularios (Datos del expediente y relaciones)
  // ==========================
  const [formExpediente, setFormExpediente] = useState({
    fechaIngreso: "",
    motivoIngreso: "",
    condicionInicial: "",
    diagnosticoInicial: "",
    tratamientoInicial: "",
    estadoActual: "",
    ultimaRevision: "",
    veterinarioResponsable: "",
    notasGenerales: "",
  });

  const [revisiones, setRevisiones] = useState([
    {
      fechaRevision: "",
      peso: "",
      diagnostico: "",
      tratamiento: "",
      estadoGeneral: "",
      observaciones: "",
      veterinario: "",
    },
  ]);

  const [vacunas, setVacunas] = useState([
    {
      fechaAplicacion: "",
      tipoVacuna: "",
      producto: "",
      dosis: "",
      proximaAplicacion: "",
      veterinario: "",
    },
  ]);

  const [desparasitaciones, setDesparasitaciones] = useState([
    {
      fechaAplicacion: "",
      tipo: "",
      producto: "",
      dosis: "",
      proximaAplicacion: "",
      veterinario: "",
    },
  ]);

  const [evaluaciones, setEvaluaciones] = useState([
    { fecha: "", descripcion: "", progreso: "", evaluador: "" },
  ]);

  // 🔁 Utilidades para listas dinámicas
  const agregarCampo = (setter, plantilla) => setter((prev) => [...prev, { ...plantilla }]);
  const eliminarCampo = (setter, index) => setter((prev) => prev.filter((_, i) => i !== index));

  // ==========================
  // 💾 Guardar expediente completo (expediente + relaciones)
  // ==========================
  const registrarExpedienteCompleto = async (idAnimal) => {
    setError(null);
    setMensaje(null);

    try {
      // 1) Crear expediente
      const resExp = await fetch(
        "http://localhost:3001/expediente-medico/expedientes/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idAnimal, ...formExpediente }),
        }
      );
      if (!resExp.ok) throw new Error("No se pudo crear el expediente");
      const dataExp = await resExp.json();
      const idExpediente = dataExp?.id;
      if (!idExpediente) throw new Error("No se recibió el id del expediente creado");

      // 2) Crear relaciones
      const crear = async (url, lista) => {
        for (const obj of lista) {
          // Evita enviar filas totalmente vacías
          const tieneDatos = Object.values(obj).some((v) => String(v ?? "").trim() !== "");
          if (tieneDatos) {
            const r = await fetch(`http://localhost:3001/expediente-medico/${url}/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idExpediente, ...obj }),
            });
            if (!r.ok) throw new Error(`No se pudo registrar en ${url}`);
          }
        }
      };

      await crear("revisiones", revisiones);
      await crear("vacunas", vacunas);
      await crear("desparasitaciones", desparasitaciones);
      await crear("evaluaciones", evaluaciones);

      // 3) UI feedback
      const ok = document.getElementById("alertaExito");
      if (ok) {
        ok.classList.remove("d-none");
        setTimeout(() => ok.classList.add("d-none"), 4000);
      }

      // 4) Reset visual a expedientes del animal
      setMostrarFormulario(false);
      // Limpia los formularios a su estado inicial
      setFormExpediente({
        fechaIngreso: "",
        motivoIngreso: "",
        condicionInicial: "",
        diagnosticoInicial: "",
        tratamientoInicial: "",
        estadoActual: "",
        ultimaRevision: "",
        veterinarioResponsable: "",
        notasGenerales: "",
      });
      setRevisiones([
        {
          fechaRevision: "",
          peso: "",
          diagnostico: "",
          tratamiento: "",
          estadoGeneral: "",
          observaciones: "",
          veterinario: "",
        },
      ]);
      setVacunas([
        {
          fechaAplicacion: "",
          tipoVacuna: "",
          producto: "",
          dosis: "",
          proximaAplicacion: "",
          veterinario: "",
        },
      ]);
      setDesparasitaciones([
        {
          fechaAplicacion: "",
          tipo: "",
          producto: "",
          dosis: "",
          proximaAplicacion: "",
          veterinario: "",
        },
      ]);
      setEvaluaciones([{ fecha: "", descripcion: "", progreso: "", evaluador: "" }]);

      cargarExpedientes(idAnimal);
    } catch (e) {
      const bad = document.getElementById("alertaError");
      if (bad) {
        bad.classList.remove("d-none");
        setTimeout(() => bad.classList.add("d-none"), 4000);
      }
      setError(e.message || "Error al registrar expediente");
    }
  };

  // ==========================
  // 🧹 Volver / limpiar
  // ==========================
  const limpiarSeleccion = () => {
    setAnimalSeleccionado(null);
    setExpedientes([]);
    setMostrarFormulario(false);
    setMensaje(null);
    setError(null);
  };

  // ==========================
  // 📅 Fecha máxima permitida = hoy
  // ==========================
  const maxDate = new Date().toISOString().split("T")[0];

  // ==========================
  // 🎨 Render
  // ==========================
  return (
    <div className="expediente-container container py-4">
      {/* ==========================
          📋 LISTADO DE ANIMALES
         ========================== */}
      {!animalSeleccionado && !mostrarFormulario && (
        <div className="catalogo-container fade-in">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h1 className="m-0">📋 Expedientes Médicos</h1>
            {error && <span className="text-danger">{error}</span>}
          </div>

          <div className="expediente-listado">
            {animales.length === 0 && (
              <p className="text-muted">No hay animales registrados en el catálogo.</p>
            )}

            {animales.map((a) => (
              <div key={a.Id} className="expediente-item fade-in d-flex align-items-center gap-3 p-2">
                {a.imagenMain && (
                  <img
                    src={a.imagenMain}
                    alt={a.nombre}
                    className="expediente-miniatura"
                    style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 12 }}
                  />
                )}

                <div className="expediente-info flex-grow-1">
                  <h3 className="mb-1">{a.nombre || "Sin nombre"}</h3>
                  <div className="small text-muted">
                    <span><strong>Especie:</strong> {a.especie}</span>{" · "}
                    <span><strong>Sexo:</strong> {a.sexo}</span>{" · "}
                    <span><strong>Edad:</strong> {a.edadAprox || "N/D"}</span>
                  </div>
                  <div className="mt-1">
                    <span
                      className="badge text-white"
                      style={{
                        background:
                          a.estatus === "Adoptado" ? "#16a34a" :
                          a.estatus === "Disponible" ? "#2563eb" :
                          a.estatus === "En tratamiento" ? "#f59e0b" :
                          a.estatus === "Reservado" ? "#7c3aed" :
                          a.estatus === "Rehabilitación" ? "#0ea5e9" :
                          a.estatus === "Observación" ? "#10b981" :
                          a.estatus === "No disponible" ? "#ef4444" :
                          "#4b5563",
                      }}
                    >
                      {a.estatus || "No definido"}
                    </span>
                  </div>
                </div>

                {/* Acciones compactas en la misma línea */}
                <div className="expediente-acciones d-flex align-items-center gap-2 flex-wrap">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => cargarExpedientes(a.Id)}
                    title="Visualizar todos los expedientes del animal"
                  >
                    Ver expedientes
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setAnimalSeleccionado(a.Id);
                      setMostrarFormulario(true);
                    }}
                    title="Registrar expediente completo"
                  >
                    Registrar datos
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================
          🩺 VISUALIZAR EXPEDIENTES (lista)
         ========================== */}
      {animalSeleccionado && !mostrarFormulario && (
        <div className="visualizar-expediente fade-in">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="m-0">🐾 Expedientes del animal</h2>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button className="btn btn-success btn-sm" onClick={() => setMostrarFormulario(true)}>
                + Registrar datos
              </button>
              <button className="btn btn-warning btn-sm" onClick={limpiarSeleccion}>
                ← Volver
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {mensaje && <div className="alert alert-info py-2">{mensaje}</div>}

          {/* Lista de expedientes renderizada con .map() */}
          {expedientes.length > 0 && (
            <div className="expediente-lista-completa">
              {expedientes.map((expData, idx) => (
                <div key={idx} className="expediente-card border rounded p-3 mb-4 shadow-sm bg-white">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <h4 className="m-0">📋 Expediente #{expData?.expediente?.idExpediente ?? "—"}</h4>
                    <span className="small text-muted">
                      {expData?.expediente?.fechaIngreso
                        ? `Ingreso: ${expData.expediente.fechaIngreso}`
                        : "Ingreso: N/D"}
                    </span>
                  </div>

                  {/* Datos generales */}
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <strong>Motivo:</strong> {expData?.expediente?.motivoIngreso || "N/D"}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Condición inicial:</strong>{" "}
                      {expData?.expediente?.condicionInicial || "N/D"}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Diagnóstico inicial:</strong>{" "}
                      {expData?.expediente?.diagnosticoInicial || "N/D"}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Tratamiento inicial:</strong>{" "}
                      {expData?.expediente?.tratamientoInicial || "N/D"}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Estado actual:</strong> {expData?.expediente?.estadoActual || "N/D"}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Última revisión:</strong>{" "}
                      {expData?.expediente?.ultimaRevision || "N/D"}
                    </div>
                    <div className="col-md-4 mb-2">
                      <strong>Veterinario:</strong>{" "}
                      {expData?.expediente?.veterinarioResponsable || "N/D"}
                    </div>
                    <div className="col-12 mb-2">
                      <strong>Notas:</strong> {expData?.expediente?.notasGenerales || "N/D"}
                    </div>
                  </div>

                  {/* Revisiones */}
                  <div className="expediente-seccion mt-3">
                    <h5 className="mb-2">📅 Revisiones</h5>
                    {expData?.revisiones?.length > 0 ? (
                      expData.revisiones.map((r, i) => (
                        <div key={i} className="border rounded p-2 mb-2 bg-light">
                          <div className="row">
                            <div className="col-md-4">
                              <strong>Fecha:</strong> {r.fechaRevision || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Peso:</strong> {r.peso || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Diagnóstico:</strong> {r.diagnostico || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Tratamiento:</strong> {r.tratamiento || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Estado:</strong> {r.estadoGeneral || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Veterinario:</strong> {r.veterinario || "N/D"}
                            </div>
                            <div className="col-12">
                              <strong>Observaciones:</strong> {r.observaciones || "N/D"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-2">No hay revisiones registradas.</p>
                    )}
                  </div>

                  {/* Vacunas */}
                  <div className="expediente-seccion mt-3">
                    <h5 className="mb-2">💉 Vacunas</h5>
                    {expData?.vacunas?.length > 0 ? (
                      expData.vacunas.map((v, i) => (
                        <div key={i} className="border rounded p-2 mb-2 bg-light">
                          <div className="row">
                            <div className="col-md-4">
                              <strong>Fecha:</strong> {v.fechaAplicacion || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Tipo:</strong> {v.tipoVacuna || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Producto:</strong> {v.producto || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Dosis:</strong> {v.dosis || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Próxima:</strong> {v.proximaAplicacion || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Veterinario:</strong> {v.veterinario || "N/D"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-2">No hay vacunas registradas.</p>
                    )}
                  </div>

                  {/* Desparasitaciones */}
                  <div className="expediente-seccion mt-3">
                    <h5 className="mb-2">💊 Desparasitaciones</h5>
                    {expData?.desparasitaciones?.length > 0 ? (
                      expData.desparasitaciones.map((d, i) => (
                        <div key={i} className="border rounded p-2 mb-2 bg-light">
                          <div className="row">
                            <div className="col-md-4">
                              <strong>Fecha:</strong> {d.fechaAplicacion || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Tipo:</strong> {d.tipo || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Producto:</strong> {d.producto || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Dosis:</strong> {d.dosis || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Próxima:</strong> {d.proximaAplicacion || "N/D"}
                            </div>
                            <div className="col-md-4">
                              <strong>Veterinario:</strong> {d.veterinario || "N/D"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-2">No hay desparasitaciones registradas.</p>
                    )}
                  </div>

                  {/* Evaluaciones */}
                  <div className="expediente-seccion mt-3">
                    <h5 className="mb-2">🧠 Evaluaciones</h5>
                    {expData?.evaluaciones?.length > 0 ? (
                      expData.evaluaciones.map((e, i) => (
                        <div key={i} className="border rounded p-2 mb-2 bg-light">
                          <div className="row">
                            <div className="col-md-3">
                              <strong>Fecha:</strong> {e.fecha || "N/D"}
                            </div>
                            <div className="col-md-5">
                              <strong>Descripción:</strong> {e.descripcion || "N/D"}
                            </div>
                            <div className="col-md-2">
                              <strong>Progreso:</strong> {e.progreso || "N/D"}
                            </div>
                            <div className="col-md-2">
                              <strong>Evaluador:</strong> {e.evaluador || "N/D"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-2">No hay evaluaciones registradas.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================
          🧾 REGISTRAR EXPEDIENTE (formulario completo)
         ========================== */}
      {animalSeleccionado && mostrarFormulario && (
        <div className="formulario-expediente fade-in container mt-4">
          <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="m-0">Registrar expediente completo</h2>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-warning btn-sm" onClick={limpiarSeleccion}>
                ← Volver
              </button>
            </div>
          </div>

          {/* 🔔 ALERTAS DE ESTADO */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
              <strong>Error:</strong> {error}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}
          <div id="alertaExito" className="alert alert-success d-none py-2" role="alert">
            ✅ Expediente guardado correctamente.
          </div>
          <div id="alertaError" className="alert alert-danger d-none py-2" role="alert">
            ❌ Error al registrar expediente.
          </div>

          <form
            className="form-expediente"
            onSubmit={(e) => {
              e.preventDefault();
              registrarExpedienteCompleto(animalSeleccionado);
            }}
          >
            {/* DATOS GENERALES */}
            <div className="form-section mb-4">
              <h3>📋 Datos generales</h3>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Fecha de ingreso</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    max={maxDate}
                    required
                    value={formExpediente.fechaIngreso}
                    onChange={(e) =>
                      setFormExpediente({ ...formExpediente, fechaIngreso: e.target.value })
                    }
                  />
                  <small className="text-muted">¿Cuándo ingresó el animal?</small>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Motivo de ingreso</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej. revisión general, cirugía, control"
                    value={formExpediente.motivoIngreso}
                    onChange={(e) =>
                      setFormExpediente({ ...formExpediente, motivoIngreso: e.target.value })
                    }
                  />
                  <small className="text-muted">¿Por qué se atendió hoy?</small>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Condición inicial</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej. débil, con fiebre, sin apetito"
                    value={formExpediente.condicionInicial}
                    onChange={(e) =>
                      setFormExpediente({ ...formExpediente, condicionInicial: e.target.value })
                    }
                  />
                  <small className="text-muted">¿Cómo llegó el animal?</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Diagnóstico inicial</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej. infección leve, parásitos intestinales"
                    value={formExpediente.diagnosticoInicial}
                    onChange={(e) =>
                      setFormExpediente({ ...formExpediente, diagnosticoInicial: e.target.value })
                    }
                  />
                  <small className="text-muted">Diagnóstico presuntivo/confirmado.</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Tratamiento inicial</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej. antibiótico 5 días, dieta blanda"
                    value={formExpediente.tratamientoInicial}
                    onChange={(e) =>
                      setFormExpediente({ ...formExpediente, tratamientoInicial: e.target.value })
                    }
                  />
                  <small className="text-muted">Medicamentos/indicaciones al ingreso.</small>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Estado actual</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej. estable, mejorando"
                    value={formExpediente.estadoActual}
                    onChange={(e) =>
                      setFormExpediente({ ...formExpediente, estadoActual: e.target.value })
                    }
                  />
                  <small className="text-muted">Estatus al momento del registro.</small>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Última revisión</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    max={maxDate}
                    value={formExpediente.ultimaRevision}
                    onChange={(e) =>
                      setFormExpediente({ ...formExpediente, ultimaRevision: e.target.value })
                    }
                  />
                  <small className="text-muted">Fecha de la revisión más reciente.</small>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Veterinario responsable</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Nombre completo del veterinario"
                    value={formExpediente.veterinarioResponsable}
                    onChange={(e) =>
                      setFormExpediente({
                        ...formExpediente,
                        veterinarioResponsable: e.target.value,
                      })
                    }
                  />
                  <small className="text-muted">Nombre y apellidos.</small>
                </div>

                <div className="col-12">
                  <label className="form-label">Notas generales</label>
                  <textarea
                    className="form-control form-control-sm"
                    placeholder="Observaciones adicionales o recomendaciones"
                    value={formExpediente.notasGenerales}
                    onChange={(e) =>
                      setFormExpediente({ ...formExpediente, notasGenerales: e.target.value })
                    }
                  ></textarea>
                  <small className="text-muted">Información relevante adicional.</small>
                </div>
              </div>
            </div>

            {/* REVISIONES */}
            <div className="form-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="m-0">📅 Revisiones</h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    agregarCampo(setRevisiones, {
                      fechaRevision: "",
                      peso: "",
                      diagnostico: "",
                      tratamiento: "",
                      estadoGeneral: "",
                      observaciones: "",
                      veterinario: "",
                    })
                  }
                >
                  + Agregar revisión
                </button>
              </div>

              {revisiones.map((r, i) => (
                <div key={i} className="border rounded p-3 mb-3">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Fecha de revisión</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        max={maxDate}
                        value={r.fechaRevision}
                        onChange={(e) => {
                          const c = [...revisiones];
                          c[i].fechaRevision = e.target.value;
                          setRevisiones(c);
                        }}
                      />
                      <small className="text-muted">¿Cuándo se revisó?</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Peso</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. 12.5 kg"
                        value={r.peso}
                        onChange={(e) => {
                          const c = [...revisiones];
                          c[i].peso = e.target.value;
                          setRevisiones(c);
                        }}
                      />
                      <small className="text-muted">Incluye unidad (kg).</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Diagnóstico</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. gastritis leve"
                        value={r.diagnostico}
                        onChange={(e) => {
                          const c = [...revisiones];
                          c[i].diagnostico = e.target.value;
                          setRevisiones(c);
                        }}
                      />
                      <small className="text-muted">¿Qué se diagnosticó?</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Tratamiento</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. dieta blanda 5 días"
                        value={r.tratamiento}
                        onChange={(e) => {
                          const c = [...revisiones];
                          c[i].tratamiento = e.target.value;
                          setRevisiones(c);
                        }}
                      />
                      <small className="text-muted">¿Qué se indicó?</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Estado general</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. mejorando, estable"
                        value={r.estadoGeneral}
                        onChange={(e) => {
                          const c = [...revisiones];
                          c[i].estadoGeneral = e.target.value;
                          setRevisiones(c);
                        }}
                      />
                      <small className="text-muted">Resumen actual.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Veterinario</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nombre y apellidos"
                        value={r.veterinario}
                        onChange={(e) => {
                          const c = [...revisiones];
                          c[i].veterinario = e.target.value;
                          setRevisiones(c);
                        }}
                      />
                      <small className="text-muted">¿Quién revisó?</small>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Observaciones</label>
                      <textarea
                        className="form-control form-control-sm"
                        placeholder="Notas clínicas, evolución específica, pruebas solicitadas..."
                        value={r.observaciones}
                        onChange={(e) => {
                          const c = [...revisiones];
                          c[i].observaciones = e.target.value;
                          setRevisiones(c);
                        }}
                      ></textarea>
                      <small className="text-muted">Detalles importantes.</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-3 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarCampo(setRevisiones, i)}
                    >
                      Eliminar revisión
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* VACUNAS */}
            <div className="form-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="m-0">💉 Vacunas</h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    agregarCampo(setVacunas, {
                      fechaAplicacion: "",
                      tipoVacuna: "",
                      producto: "",
                      dosis: "",
                      proximaAplicacion: "",
                      veterinario: "",
                    })
                  }
                >
                  + Agregar vacuna
                </button>
              </div>

              {vacunas.map((v, i) => (
                <div key={i} className="border rounded p-3 mb-3">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Fecha aplicada</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        max={maxDate}
                        value={v.fechaAplicacion}
                        onChange={(e) => {
                          const c = [...vacunas];
                          c[i].fechaAplicacion = e.target.value;
                          setVacunas(c);
                        }}
                      />
                      <small className="text-muted">¿Cuándo se aplicó?</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Tipo de vacuna</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. antirrábica, múltiple"
                        value={v.tipoVacuna}
                        onChange={(e) => {
                          const c = [...vacunas];
                          c[i].tipoVacuna = e.target.value;
                          setVacunas(c);
                        }}
                      />
                      <small className="text-muted">Nombre/indicación.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Producto</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Marca o lote"
                        value={v.producto}
                        onChange={(e) => {
                          const c = [...vacunas];
                          c[i].producto = e.target.value;
                          setVacunas(c);
                        }}
                      />
                      <small className="text-muted">Marca y/o lote.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Dosis</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. 1 ml"
                        value={v.dosis}
                        onChange={(e) => {
                          const c = [...vacunas];
                          c[i].dosis = e.target.value;
                          setVacunas(c);
                        }}
                      />
                      <small className="text-muted">Cantidad aplicada.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Próxima aplicación</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        max={maxDate}
                        value={v.proximaAplicacion}
                        onChange={(e) => {
                          const c = [...vacunas];
                          c[i].proximaAplicacion = e.target.value;
                          setVacunas(c);
                        }}
                      />
                      <small className="text-muted">Fecha estimada próxima dosis.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Veterinario</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nombre y apellidos"
                        value={v.veterinario}
                        onChange={(e) => {
                          const c = [...vacunas];
                          c[i].veterinario = e.target.value;
                          setVacunas(c);
                        }}
                      />
                      <small className="text-muted">¿Quién aplicó?</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-3 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarCampo(setVacunas, i)}
                    >
                      Eliminar vacuna
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESPARASITACIONES */}
            <div className="form-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="m-0">💊 Desparasitaciones</h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    agregarCampo(setDesparasitaciones, {
                      fechaAplicacion: "",
                      tipo: "",
                      producto: "",
                      dosis: "",
                      proximaAplicacion: "",
                      veterinario: "",
                    })
                  }
                >
                  + Agregar desparasitación
                </button>
              </div>

              {desparasitaciones.map((d, i) => (
                <div key={i} className="border rounded p-3 mb-3">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Fecha aplicación</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        max={maxDate}
                        value={d.fechaAplicacion}
                        onChange={(e) => {
                          const c = [...desparasitaciones];
                          c[i].fechaAplicacion = e.target.value;
                          setDesparasitaciones(c);
                        }}
                      />
                      <small className="text-muted">¿Cuándo se aplicó?</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Tipo</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. interna o externa"
                        value={d.tipo}
                        onChange={(e) => {
                          const c = [...desparasitaciones];
                          c[i].tipo = e.target.value;
                          setDesparasitaciones(c);
                        }}
                      />
                      <small className="text-muted">Tipo de desparasitación.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Producto</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. ivermectina"
                        value={d.producto}
                        onChange={(e) => {
                          const c = [...desparasitaciones];
                          c[i].producto = e.target.value;
                          setDesparasitaciones(c);
                        }}
                      />
                      <small className="text-muted">Nombre comercial o fármaco.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Dosis</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. 2 ml"
                        value={d.dosis}
                        onChange={(e) => {
                          const c = [...desparasitaciones];
                          c[i].dosis = e.target.value;
                          setDesparasitaciones(c);
                        }}
                      />
                      <small className="text-muted">Cantidad aplicada.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Próxima aplicación</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        max={maxDate}
                        value={d.proximaAplicacion}
                        onChange={(e) => {
                          const c = [...desparasitaciones];
                          c[i].proximaAplicacion = e.target.value;
                          setDesparasitaciones(c);
                        }}
                      />
                      <small className="text-muted">Fecha estimada.</small>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Veterinario</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nombre y apellidos"
                        value={d.veterinario}
                        onChange={(e) => {
                          const c = [...desparasitaciones];
                          c[i].veterinario = e.target.value;
                          setDesparasitaciones(c);
                        }}
                      />
                      <small className="text-muted">¿Quién aplicó?</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-3 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarCampo(setDesparasitaciones, i)}
                    >
                      Eliminar desparasitación
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* EVALUACIONES */}
            <div className="form-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="m-0">🧠 Evaluaciones</h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    agregarCampo(setEvaluaciones, {
                      fecha: "",
                      descripcion: "",
                      progreso: "",
                      evaluador: "",
                    })
                  }
                >
                  + Agregar evaluación
                </button>
              </div>

              {evaluaciones.map((e, i) => (
                <div key={i} className="border rounded p-3 mb-3">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Fecha evaluación</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        max={maxDate}
                        value={e.fecha}
                        onChange={(ev) => {
                          const c = [...evaluaciones];
                          c[i].fecha = ev.target.value;
                          setEvaluaciones(c);
                        }}
                      />
                      <small className="text-muted">¿Cuándo se evaluó?</small>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Descripción</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. conducta agresiva leve, respuesta al manejo"
                        value={e.descripcion}
                        onChange={(ev) => {
                          const c = [...evaluaciones];
                          c[i].descripcion = ev.target.value;
                          setEvaluaciones(c);
                        }}
                      />
                      <small className="text-muted">¿Qué se observó?</small>
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Progreso</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. mejorando, estable"
                        value={e.progreso}
                        onChange={(ev) => {
                          const c = [...evaluaciones];
                          c[i].progreso = ev.target.value;
                          setEvaluaciones(c);
                        }}
                      />
                      <small className="text-muted">Evolución general.</small>
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Evaluador</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nombre y apellidos"
                        value={e.evaluador}
                        onChange={(ev) => {
                          const c = [...evaluaciones];
                          c[i].evaluador = ev.target.value;
                          setEvaluaciones(c);
                        }}
                      />
                      <small className="text-muted">¿Quién evaluó?</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-3 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarCampo(setEvaluaciones, i)}
                    >
                      Eliminar evaluación
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÓN FINAL */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-success btn-sm">
                💾 Guardar expediente completo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
