import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../values/apis"

// const API_URL = "http://192.168.0.12:8000/api"; // ajustar si se utiliza en 0.0.0.0
// const API_URL = "http://localhost:8000/api"; // ajustar si se utiliza en 0.0.0.0

export default function FormularioResponder({ formularioId, usuario }) {
  const [formulario, setFormulario] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [oficina, setOficina] = useState("");
  const [comentario, setComentario] = useState("");

  // Cargar formulario
  useEffect(() => {
    axios
      .get(`${API_URL}/formularios/ultimo/`)
      .then((res) => setFormulario(res.data))
      .catch((err) => console.error(err));
  }, [formularioId]);

  // Cambiar respuesta
  const handleRespuesta = (id, campo, valor) => {
    setRespuestas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  };

  // Toggle habilitada
  const toggleHabilitada = (id) => {
    setRespuestas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        habilitada: !(prev[id]?.habilitada ?? true),
      },
    }));
  };

  // Enviar respuestas
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      formulario: formularioId,
      usuario: usuario || "Anonimo",
      oficina: oficina,
      respuestas: Object.entries(respuestas).map(([preguntaId, datos]) => ({
        pregunta: preguntaId,
        valor: datos.valor || null,
        comentario: datos.comentario || "",
        habilitada: datos.habilitada !== false,
      })),
    };

    try {
      await axios.post(`${API_URL}/respuestas/`, payload);
      alert("Formulario enviado ✅");
      setRespuestas({});
    } catch (err) {
      console.error(err);
      alert("Error al enviar ❌");
    }
  };

  if (!formulario) return <p>Cargando...</p>;
  if (formulario.length === 0) return <p>No hay formularios aún.</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-100">
      <h2 className="text-2xl font-bold">{formulario.titulo}</h2>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Oficia de Representación
        </label>
        <input
          type="text"
          value={oficina}
          onChange={(e) => setOficina(e.target.value)}
          placeholder="Escribe la oficina de representación"
          className="border p-2 rounded w-full"
        />
        <label className="block text-gray-700 font-semibold mb-1">
          Comentario
        </label>
        <input
          type="text"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario"
          className="border p-2 rounded w-full"
        />
      </div>
      {/* <p className="text-gray-600">{formulario.descripcion}</p> */}

      {/* SECCIONES */}
      {formulario.secciones.map((seccion) => {

        const secDisabled = respuestas[`seccion-${seccion.id}`]?.habilitada === false;

        return (
          <details key={seccion.id} className="border p-4 rounded-lg shadow">
            <summary className="flex justify-between items-center">
              <h3 className="text-xl font-semibold ">{seccion.titulo}</h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={secDisabled}
                  onChange={() => toggleHabilitada(`seccion-${seccion.id}`)}
                />
                No aplica
              </label>
            </summary>

            {!secDisabled && (
              <div className="space-y-4 mt-3">
                {/* SUBSECCIONES */}
                {seccion.subsecciones.map((sub) => {
                  const subDisabled =
                    respuestas[`sub-${sub.id}`]?.habilitada === false;

                  return (
                    <details key={sub.id}
                      className="ml-4 mt-2 border-l-4 pl-4 border-gray-300"
                    >
                      <summary className="flex justify-between items-center">
                        <h4 className="font-semibold ">
                          {sub.titulo}
                        </h4>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={subDisabled}
                            onChange={() => toggleHabilitada(`sub-${sub.id}`)}
                          />
                          No aplica
                        </label>
                      </summary>

                      {!subDisabled && (
                        <div className="space-y-3 mt-2">
                          {/* PREGUNTAS */}
                          {sub.preguntas.map((preg) => {
                            const pregDisabled =
                              respuestas[preg.id]?.habilitada === false;

                            return (
                              <div
                                key={preg.id}
                                className="mt-3 p-2 bg-gray-50 rounded"
                              >
                                <div className="flex justify-between items-center">
                                  <p className="font-medium text-gray-900">{preg.texto}</p>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={pregDisabled}
                                      onChange={() => toggleHabilitada(preg.id)}
                                    />
                                    No aplica
                                  </label>
                                </div>

                                {!pregDisabled && (
                                  <div className="mt-2 space-y-2">
                                    {/* Render dinámico por tipo */}
                                    {preg.tipo === "SI_NO" && (
                                      <select
                                        value={respuestas[preg.id]?.valor || ""}
                                        onChange={(e) =>
                                          handleRespuesta(
                                            preg.id,
                                            "valor",
                                            e.target.value
                                          )
                                        }
                                        className="border p-2 rounded w-full"
                                      >
                                        <option value="">Selecciona...</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                      </select>
                                    )}

                                    {preg.tipo === "VALORACION" && (
                                      <select
                                        value={respuestas[preg.id]?.valor || ""}
                                        onChange={(e) =>
                                          handleRespuesta(
                                            preg.id,
                                            "valor",
                                            e.target.value
                                          )
                                        }
                                        className="border p-2 rounded w-full"
                                      >
                                        <option value="">Selecciona...</option>
                                        <option value="bueno">Bueno</option>
                                        <option value="regular">Regular</option>
                                        <option value="malo">Malo</option>
                                      </select>
                                    )}

                                    {preg.tipo === "COMENTARIO" && (
                                      <textarea
                                        value={
                                          respuestas[preg.id]?.comentario || ""
                                        }
                                        onChange={(e) =>
                                          handleRespuesta(
                                            preg.id,
                                            "comentario",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Escribe tu comentario..."
                                        className="border p-2 rounded w-full"
                                      />
                                    )}

                                    {/* Comentario adicional opcional */}
                                    {preg.tipo !== "comentario" && (
                                      <details className="mt-2">
                                        <summary className="cursor-pointer text-sm text-gray-600">
                                          Observaciones
                                        </summary>
                                        <textarea
                                          value={
                                            respuestas[preg.id]?.comentario || ""
                                          }
                                          onChange={(e) =>
                                            handleRespuesta(
                                              preg.id,
                                              "comentario",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Comentario adicional"
                                          className="border p-2 rounded w-full"
                                        />
                                      </details>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </details>
                  );
                })}
              </div>
            )}
          </details>
        );
      })}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
      >
        Enviar respuestas
      </button>
    </form>
  );
}
