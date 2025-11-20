import { useState } from "react";
import Preguntas from "./views/Preguntas";
import FormularioResponder from "./views/FormularioResponder";
import BottomBar from "./components/BottomBar";
import NuevoFormulario from "./views/NuevoFormulario";
import Respuestas from "./views/Respuestas";
import RegistroS from "./views/RegistroS";

function Inicio({ irA }) {
  const botones = [
    { id: 1, texto: "Panel de Control", ruta: "panel" },
    { id: 2, texto: "Registros", ruta: "registros" },
    { id: 3, texto: "Reportes", ruta: "reportes" },
  ];

  return (

    <div className="flex flex-col items-center justify-center w-full h-full gap-8">
      {/* Fila 1: un botón */}
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Bienvenido a la Aplicación
        </h1>
      </div>

      {/* Fila 2: tres botones */}
      <div className="flex justify-center gap-6">
        {botones.map((boton) => (
            <button
              key={boton.id} 
              className="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200"
              onClick={() => irA(boton.ruta)}
            >
              {boton.texto}
            </button>
          ))}
      </div>
    </div>
  );
}

function Panel({ volver }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Panel de Control</h2>
      <button
        onClick={volver}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Volver
      </button>
    </div>
  );
}

function Registros({ volver }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Registros</h2>
      <button
        onClick={volver}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Volver
      </button>
    </div>
  );
}


function Reportes({ volver }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Reportes</h2>
      <button
        onClick={volver}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Volver
      </button>
    </div>
  );
}

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");

  return (
    <>
      {pantalla === "inicio" && <Inicio irA={setPantalla} />}
      {/* {pantalla === "panel" && <Panel volver={() => setPantalla("inicio")} />} */}
      {pantalla === "panel" && <Registros volver={() => setPantalla("inicio")}/>}
      {pantalla === "registros" && <Registros volver={() => setPantalla("inicio")} />}
      {pantalla === "reportes" && <Reportes volver={() => setPantalla("inicio")} />}
    </>
  );

}

// export default function App() {

//   const [activeTab, setActiveTab] = useState(3); // 1 = Preguntas
//   const [editingForm, setEditingForm] = useState(null);

//   const renderView = () => {
//     switch (activeTab) {
//       case 1:
//         // return <Preguntas />;
//         return (
//           <div className="min-h-screen bg-gray-100">
//             {editingForm ? (
//               <NuevoFormulario
//                 existingForm={editingForm}
//                 onBack={() => setEditingForm(null)}
//               />
//             ) : (
//               <Preguntas onEdit={setEditingForm} />
//             )}
//           </div>
//         );
//       case 2:
//         return <FormularioResponder formularioId={1} />;
//       case 3:
//         return <NuevoFormulario />;
//       case 4:
//           return <Respuestas />;
//       default:
//         return <Preguntas />;
//     }
//   };

//   return (
//     <>
//         <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//             <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
//                 {renderView()}
//             </div>
//             <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
//         </div>
//     </>
//   );
// }

// export default App;