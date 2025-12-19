import { useState } from "react";
import BottomBar from "./components/BottomBar";
import AuxBottomBar from "./components/AuxBottomBar";
import FormularioResponder from "./views/FormularioResponder";
import NuevoFormulario from "./views/NuevoFormulario";
import Preguntas from "./views/Preguntas";
import RevisarFormularios from "./views/RevisarFormularios";
import VistaLlenar from "./views/VistaLlenar";

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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 pb-20">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Instrucciones</h2>
      <p className="text-gray-600">Listado de Instrucciones</p>
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