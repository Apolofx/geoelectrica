import { observer } from "mobx-react-lite";
import { useParams } from "react-router";
import store from "store";
import { LinkButton } from "components";
/**
 * Route: /e/:eid/s/:sid
 * Esta ruta debería permitir visualizar la "planilla" de un sondeo
 * sonde se muestran los datos basicos del sondeo y las mediciones (estaciones) realizadas.
 * TODO: agregar grafica en escala doble logartmica para graficar curva
 */

const ViewSondeo = observer(() => {
  const {
    eid: estudioID = "id-no-definido",
    sid: sondeoID = "id-no-definido",
  } = useParams();
  const { historialDeEstudios: historial } = store;
  const estudio = historial.getEstudioPorID(estudioID);
  const sondeo = estudio.getSondeoByID(Number(sondeoID));
  return (
    <>
      <h1>Detalles de Sondeo {sondeo.getSevNro()}</h1>
      <h3>Coordenadas: {sondeo.getCoordenadas()}</h3>
      <h3>Zona: {sondeo.getZona()}</h3>
      <h3>Observaciones: {sondeo.getObservaciones()}</h3>

      {!sondeo.hasMediciones() && <p>No hay mediciones regitradas</p>}
      {sondeo.hasMediciones() && (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>AB/2</th>
              <th>MN</th>
              <th>I(mA)</th>
              <th>V(mV)</th>
              <th>R</th>
            </tr>
          </thead>
          <tbody>
            {sondeo.getMediciones().map((medicion) => (
              <tr>
                <td>{medicion.getA_B_Sobre2()}</td>
                <td>{medicion.getMN()}</td>
                <td>{medicion.getIntensidad()}</td>
                <td>{medicion.getTension()}</td>
                <td>{Number(medicion.getResistividadAparente()).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {sondeo.hasMediciones() && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            className="danger-bg"
            onClick={() => sondeo.removeLastMedicion()}
          >
            Eliminar ultima medicion
          </button>
        </div>
      )}
      <div
        style={{
          position: "fixed",
          justifyContent: "center",
          bottom: "10px",
          right: "10px",
        }}
      >
        <LinkButton to={`/e/${estudioID}/s/${sondeoID}/m/create`}>
          Nueva medición
        </LinkButton>
      </div>
    </>
  );
});

export default ViewSondeo;
