import { observer } from "mobx-react-lite";
import { Link, useParams } from "react-router";
import store from "store";
/**
 * Esta vista debería renderizar la lista de sondeos correspondiente a un estudio.
 * La lista de sondeo la vamos a obtener usando:
 * 1. El id del estudio
 * 2. El historial de estudios (pasado por contexto)
 */
const ViewEstudio = observer(() => {
  const { eid: id = "id-no-definido" } = useParams();
  const { historialDeEstudios: historial } = store;
  const estudio = historial.getEstudioPorID(id);
  const sondeos = estudio.getSondeos();
  return (
    <>
      <h3>Cliente: {estudio.getCliente()}</h3>
      <h3>Zona: {estudio.getZona()}</h3>
      <h3>Fecha: {estudio.getFecha().toLocaleDateString("es-AR")}</h3>
      {!sondeos.length && <p>No hay sondeos registrados</p>}

      {Boolean(sondeos.length) && (
        <>
          <h3>Sondeos</h3>
          <div>
            {sondeos.map((sondeo) => (
              <div
                key={sondeo.getID()}
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>
                  {`Sondeo ${sondeo.getSevNro()} ${sondeo.getCoordenadas()} ${sondeo
                    .getFecha()
                    .toLocaleDateString("es-AR")}`}
                </p>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <button
                    className="link-button danger-bg"
                    onClick={() => estudio.removeSondeoByID(sondeo.getID())}
                  >
                    Borrar
                  </button>
                  <Link to={`/e/${id}/s/${sondeo.getID()}`}>
                    <button className="link-button">Ver</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="fixed-bottom-right">
        <Link to={`/e/${id}/s/create`}>
          <button>Nuevo Sondeo</button>
        </Link>
      </div>
    </>
  );
});

export default ViewEstudio;
