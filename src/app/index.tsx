import "./app.css";
import { observer } from "mobx-react-lite";
import { Link } from "react-router";
import store from "store";

export const App = observer(() => {
  const { historialDeEstudios: historial } = store;
  return (
    <>
      <h3>Historial de Estudios</h3>
      {/* Empty estudios */}
      {!historial.getEstudios().length && <p>No hay estudios registrados</p>}

      {/* Lista de estudios */}
      {historial.getEstudios().map((estudio) => (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          key={estudio.getID()}
        >
          <p>{`${estudio.getCliente()} - ${
            estudio.getFecha().toISOString().split("T")[0]
          }`}</p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              style={{ padding: "4px 8px", backgroundColor: "#F5A898" }}
              onClick={() => {
                historial.removeEstudioPorID(estudio.getID());
              }}
            >
              Eliminar
            </button>
            <Link to={`/e/${estudio.getID()}`}>
              <button style={{ padding: "4px 8px" }}>Ver</button>
            </Link>
          </div>
        </div>
      ))}
      <div
        style={{
          position: "fixed",
          justifyContent: "center",
          bottom: "10px",
          right: "10px",
        }}
      >
        <Link to="/e/create">
          <button>Nuevo Estudio</button>
        </Link>
      </div>
    </>
  );
});
