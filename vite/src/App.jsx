import { useState, useEffect } from "react";
import BottomBar from "./components/BottomBar";
import AuxBottomBar from "./components/AuxBottomBar";
import FormularioResponder from "./views/FormularioResponder";
import NuevoFormulario from "./views/NuevoFormulario";
import Preguntas from "./views/Preguntas";
import RevisarFormularios from "./views/RevisarFormularios";
import VistaLlenar from "./views/VistaLlenar";
import axios from "axios";
import { API_URL } from "./values/apis"

function Registro({ subTab }) {
  const [editingForm, setEditingForm] = useState(null);
  const [editingRespuestaId, setEditingRespuestaId] = useState(null);

  const handleEditRespuesta = (id) => {
    setEditingRespuestaId(id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-250 pb-20 pt-10">
      {subTab === "llenar" ? (
        <div className="w-full h-full overflow-y-auto pb-24">
          <VistaLlenar formularioId={1} usuario="Usuario Demo" />
        </div>
      ) : subTab === "configurar" ? (
        <div className="w-full h-full overflow-y-auto pb-24">
          <NuevoFormulario />
        </div>
      ) : subTab === "editar" ? (
        <div className="w-full h-full overflow-y-auto pb-24">
          {editingForm ? (
            <NuevoFormulario
              existingForm={editingForm}
              onBack={() => setEditingForm(null)}
            />
          ) : (
            <Preguntas onEdit={setEditingForm} />
          )}
        </div>
      ) : (
        // Vista Revisar
        <div className="w-full h-full overflow-y-auto pb-24">
          {editingRespuestaId ? (
            <FormularioResponder
              formularioId={1} // Idealmente esto vendría de la respuesta, pero por ahora hardcodeamos 1 o lo sacamos del fetch
              usuario="Usuario Demo"
              respuestaId={editingRespuestaId}
              onBack={() => setEditingRespuestaId(null)}
            />
          ) : (
            <RevisarFormularios onEdit={handleEditRespuesta} />
          )}
        </div>
      )}
    </div>
  );
}

function Instrucciones() {
  const [instrucciones, setInstrucciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // view: "list", "setup", "form"
  const [view, setView] = useState("list");

  // Setup state
  const [setupData, setSetupData] = useState({
    oficina: "",
    fecha_inicio: ""
  });

  // Form state
  const [formData, setFormData] = useState({
    antecedente: "",
    instrucciones: "",
    area: [],
    rubro: "",
    fecha_termino: ""
  });

  // Catalogs State
  const [listOrs, setListOrs] = useState(["OR CDMX", "OR JAL", "OR NL", "OR YUC", "OR GTO", "OR PUE"]);
  const [listAreas, setListAreas] = useState(["Dirección General", "Jurídico", "Recursos Humanos", "Finanzas", "Operaciones", "TI"]);
  const [listRubros, setListRubros] = useState(["Auditoría", "Legal", "Administrativo", "Fiscal", "Control Interno", "Presupuesto"]);

  // Fetch data from API
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        // Fetch Areas/ORs
        const resAreas = await axios.get(`${API_URL}/areas/`);
        if (resAreas.data && resAreas.data.length > 0) {
          // Assuming the backend returns objects with 'nickname' or 'name'. 
          // Based on user inputs and typical Django behavior.
          const areaNames = resAreas.data.map(item => item.nickname || item.name || item.toString());
          setListAreas(areaNames); // All areas
          setListOrs(areaNames.slice(0, 32)); // First 32 only
        }

        // Fetch Rubros
        const resRubros = await axios.get(`${API_URL}/rubros/`);
        if (resRubros.data && resRubros.data.length > 0) {
          const rubroNames = resRubros.data.map(item => item.tipo || item.toString());
          setListRubros(rubroNames);
        }

      } catch (error) {
        console.error("Error fetching catalogs, using defaults", error);
      }
    };

    fetchCatalogs();
  }, []);

  // Fetch Instructions
  useEffect(() => {
    const fetchInstrucciones = async () => {
      try {
        const response = await fetch(`${API_URL}/registro_temporal/`);
        if (response.ok) {
          const data = await response.json();
          setInstrucciones(data);
        } else {
          console.error("Error fetching instrucciones");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (view === "list") {
      fetchInstrucciones();
    }
  }, [view]);

  const handleAggregateClick = () => {
    const cachedOficina = localStorage.getItem("oficina_instrucciones");
    const cachedFecha = localStorage.getItem("fecha_inicio_instrucciones");

    if (cachedOficina && cachedFecha) {
      setSetupData({ oficina: cachedOficina, fecha_inicio: cachedFecha });
      setFormData(prev => ({ ...prev, area: [cachedOficina] }));
      setView("form");
    } else {
      setView("setup");
    }
  };

  const handleSetupContinue = () => {
    if (setupData.oficina && setupData.fecha_inicio) {
      localStorage.setItem("oficina_instrucciones", setupData.oficina);
      localStorage.setItem("fecha_inicio_instrucciones", setupData.fecha_inicio);
      setFormData(prev => ({ ...prev, area: [setupData.oficina] }));
      setView("form");
    } else {
      alert("Por favor selecciona OR y Fecha de Inicio");
    }
  };

  const handleSaveInstruction = async () => {
    // Logic to save instruction would go here
    console.log("Saving:", { ...setupData, ...formData });

    // Construct payload matching serializer if needed, or just dummy for now
    // Since specific endpoint logic wasn't requested for saving, we'll just log and go back

    setView("list");
    setFormData({
      antecedente: "",
      instrucciones: "",
      area: [],
      rubro: "",
      fecha_termino: ""
    });
  };

  // --- RENDER HELPERS ---

  if (view === "setup") {
    return ( // Pantalla 1
      <div className="flex flex-col h-screen bg-[#F0EADD] pb-20 items-center justify-center">
        <div className="bg-[#C0C0C0] p-8 rounded-3xl shadow-lg w-11/12 max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-[#1a4a3b] text-center">Configuración Inicial</h2>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Selecciona OR</label>
            <select
              className="w-full p-2 rounded-md border border-gray-400"
              value={setupData.oficina}
              onChange={(e) => setSetupData({ ...setupData, oficina: e.target.value })}
            >
              <option value="">-- Selecciona --</option>
              {listOrs.map(or => <option key={or} value={or}>{or}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Selecciona fecha de inicio</label>
            <input
              type="date"
              className="w-full p-2 rounded-md border border-gray-400"
              value={setupData.fecha_inicio}
              onChange={(e) => setSetupData({ ...setupData, fecha_inicio: e.target.value })}
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              className="bg-[#2F5245] text-white font-bold py-2 px-8 rounded-full shadow-md hover:bg-[#1a3a30] transition-colors"
              onClick={handleSetupContinue}
            >
              Continuar
            </button>
            <button
              className="ml-4 text-gray-600 underline"
              onClick={() => setView("list")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "form") {
    return ( // Pantalla 2
      <div className="flex flex-col h-screen bg-[#F0EADD] pb-20 items-center pt-8 overflow-y-auto">
        <div className="w-11/12 max-w-4xl space-y-6 mb-10">
          <h2 className="text-3xl font-bold text-[#1a4a3b] text-center">Nueva Instrucción</h2>

          {/* Section 1: Antecedente */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-[#1a4a3b] mb-4">Antecedente</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
              rows="5"
              placeholder="Escribe los antecedentes..."
              value={formData.antecedente}
              onChange={(e) => setFormData({ ...formData, antecedente: e.target.value })}
            ></textarea>
          </div>

          {/* Section 2: Instrucciones */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-[#1a4a3b] mb-4">Instrucciones</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
              rows="5"
              placeholder="Escribe las instrucciones..."
              value={formData.instrucciones}
              onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
            ></textarea>
          </div>

          {/* Section 3: Selects */}
          <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Áreas responsables</label>
              <select
                multiple
                className="w-full p-2 rounded-md border border-gray-300 h-32"
                value={formData.area}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({ ...formData, area: selectedOptions });
                }}
              >
                {listAreas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl/Cmd para seleccionar múltiples</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Selecciona rubro</label>
              <select
                className="w-full p-2 rounded-md border border-gray-300"
                value={formData.rubro}
                onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
              >
                <option value="">-- Selecciona --</option>
                {listRubros.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Fecha termino</label>
              <input
                type="date"
                className="w-full p-2 rounded-md border border-gray-300"
                value={formData.fecha_termino}
                onChange={(e) => setFormData({ ...formData, fecha_termino: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <button
              className="bg-[#2F5245] text-white font-bold py-3 px-12 rounded-full shadow-lg hover:bg-[#1a3a30] transition-transform transform hover:scale-105"
              onClick={handleSaveInstruction}
            >
              Guardar
            </button>
            <button
              className="text-gray-600 underline"
              onClick={() => setView("list")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View (Default)
  return (
    <div className="flex flex-col h-screen bg-[#F0EADD] pb-20 items-center">
      {/* Header */}
      <div className="pt-8 pb-4">
        <h2 className="text-3xl font-bold text-[#1a4a3b]">Cedula de Instrucciones</h2>
      </div>

      {/* Main Container */}
      <div className="bg-[#C0C0C0] w-11/12 max-w-4xl h-3/5 rounded-3xl shadow-lg p-6 overflow-y-auto space-y-3">
        {loading && <p className="text-center text-gray-600">Cargando...</p>}
        {!loading && instrucciones.length === 0 && (
          <p className="text-center text-gray-600">No hay instrucciones</p>
        )}
        {instrucciones.map((item) => (
          <div key={item.idRegistro} className="bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
            {/* Left Icon */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-red-600 font-bold text-lg">V</span>
              </div>
              <span className="font-semibold text-lg text-gray-800">{item.claveAcuerdo || "000/CHIS/00/2000"}</span>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              <button className="text-[#1a4a3b] hover:scale-110 transition-transform">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="text-[#8B0000] hover:scale-110 transition-transform">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agregar Instrucción Button */}
      <div className="mt-4">
        <button
          className="bg-[#B0B0B0] hover:bg-gray-400 text-gray-800 font-medium py-2 px-8 rounded-md shadow-sm transition-colors"
          onClick={handleAggregateClick}
        >
          Agregar instrucción
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex space-x-12">
        <button className="bg-[#2F5245] flex items-center space-x-2 px-6 py-2 rounded-lg text-white font-bold text-xl shadow-md hover:bg-[#1a3a30] transition-colors">
          <div className="bg-white rounded-full p-0.5">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </div>
          <span>Guardar</span>
        </button>

        <button className="bg-[#2F5245] flex items-center space-x-2 px-6 py-2 rounded-lg text-white font-bold text-xl shadow-md hover:bg-[#1a3a30] transition-colors">
          <div className="bg-white rounded-full p-0.5">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </div>
          <span>Word</span>
        </button>
      </div>
    </div>
  );
}

function Reportes() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 pb-20">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Reportes</h2>
      <p className="text-gray-600">Visualización de Reportes</p>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("registro");
  const [auxActiveTab, setAuxActiveTab] = useState("llenar");

  const renderView = () => {
    switch (activeTab) {
      case "registro":
        return <Registro subTab={auxActiveTab} />;
      case "instrucciones":
        return <Instrucciones />;
      case "reportes":
        return <Reportes />;
      default:
        return <Registro subTab={auxActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full h-full">
        {renderView()}
      </div>
      {activeTab === "registro" && (
        <AuxBottomBar activeOption={auxActiveTab} setActiveOption={setAuxActiveTab} />
      )}
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}