import { Medicion } from "lib";
import { DEFAULT_MN } from "lib/constants";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate, useParams } from "react-router";
import store from "store";
import { PageLayout } from "components";
const NuevaMedicion = observer(() => {
  const navigate = useNavigate();
  const inputIntensidad = React.useRef<HTMLInputElement>(null);
  const { historialDeEstudios: historial } = store;
  const {
    eid: estudioID = "id-no-definido",
    sid: sondeoID = "id-no-definido",
  } = useParams();
  const estudio = historial.getEstudioPorID(estudioID);
  const sondeo = estudio.getSondeoByID(Number(sondeoID));
  const next_medicion_params = sondeo.getNextMedicionParams();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const a_b = formData.get("a_b_sobre2");
    const m_n = formData.get("m_n");
    const intensidad = formData.get("intensidad");
    const tension = formData.get("tension");
    sondeo.addMedicion(
      new Medicion(
        Number(a_b),
        Number(m_n),
        Number(intensidad),
        Number(tension)
      )
    );
    form.reset();
    navigate(`/e/${estudioID}/s/${sondeoID}`);
  };
  React.useEffect(
    () => inputIntensidad && inputIntensidad.current?.focus(),
    []
  );
  return (
    <PageLayout backTo={`/e/${estudioID}/s/${sondeoID}`}>
      <h1>Nueva Medicion</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <label htmlFor="AB/2">AB/2</label>
        <input
          type="number"
          id="a_b_sobre2"
          name="a_b_sobre2"
          defaultValue={Number(next_medicion_params.a_b_sobre2)}
        />
        <label htmlFor="m_n">MN</label>
        <input type="number" id="m_n" name="m_n" defaultValue={DEFAULT_MN} />
        <label htmlFor="intensidad">Intensidad (mA)</label>
        <input
          type="number"
          id="intensidad"
          name="intensidad"
          required
          min={0}
          step={0.0001}
          ref={inputIntensidad}
        />
        <label htmlFor="tension">Tension (mV)</label>
        <input
          type="number"
          id="tension"
          name="tension"
          required
          min={0}
          step={0.0001}
        />
        <button type="submit">Guardar</button>
      </form>
    </PageLayout>
  );
});

export default NuevaMedicion;
