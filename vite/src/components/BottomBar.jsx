function BottomBar({ activeTab, setActiveTab }) {
  const icons = [
    { id: 1, label: "Registros Creados", svg: "❓" },
    { id: 2, label: "Responder", svg: "✍️" },
    { id: 3, label: "Nuevo Registro", svg: "➕" },
    { id: 4, label: "Ver Respuestas", svg: "📄" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "0.5rem 0",
        borderTop: "1px solid #ccc",
        background: "#f8f8f8",
      }}
    >
      {icons.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "0.5rem",
            border: "none",
            background: "transparent",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: activeTab === item.id ? "#0077ff" : "#666",
          }}
        >
          <div>{item.svg}</div>
          <small>{item.label}</small>
        </button>
      ))}
    </div>
  );
}

export default BottomBar;