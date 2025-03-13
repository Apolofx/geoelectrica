import React from "react";
import { SondeoElectrico } from "lib";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router";
import store from "store";

/**
 * Route: /e/:eid/s/create
 * Esta vista debería permitir crear y agregar un nuevo sondeo a un 
 * estudio ya creado, usando el ID del estudio obtenido del path
 */

const NuevoSondeo = observer(() => {
  const navigate = useNavigate();
  const { historialDeEstudios: historial } = store;
  const { eid: estudioID = "id-no-definido" } = useParams();
  const estudio = historial.getEstudioPorID(estudioID);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const sevNro = estudio.getNextSevNro();
    const formData = new FormData(form);
    const latitud = formData.get("latitud") as string;
    const longitud = formData.get("longitud") as string;
    const sondeo = new SondeoElectrico(
      formData.get("provincia") as string,
      sevNro,
      (formData.get("departamento") as string) || "no reportado",
      (formData.get("rumbo") as string) || "no reportado",
      (formData.get("zona") as string) || "no reportado",
      new Date(),
      `${latitud} ${longitud}` || "no reportado",
      (formData.get("observaciones") as string) || "no reportado"
    );
    estudio.addSondeo(sondeo);
    form.reset();
    navigate(`/e/${estudioID}/s/${sondeo.getID()}`);
  };

  return (
    <div>
      <h1>Nuevo Sondeo</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <label htmlFor="provincia">Provincia</label>
        <input
          type="text"
          id="provincia"
          name="provincia"
          defaultValue="Buenos Aires"
        />

        <label htmlFor="departamento">Departamento</label>
        <input type="text" id="departamento" name="departamento" />

        <label htmlFor="rumbo">Rumbo</label>
        <input type="text" id="rumbo" name="rumbo" />

        <label htmlFor="zona">Zona</label>
        <input type="text" id="zona" name="zona" />

        <label htmlFor="latitud">Coordenadas</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            style={{ width: "150px" }}
            type="text"
            id="latitud"
            name="latitud"
            required
          />
          <input
            style={{ width: "150px" }}
            type="text"
            id="longitud"
            name="longitud"
            required
          />
        </div>

        <label htmlFor="observaciones">Observaciones</label>
        <textarea id="observaciones" name="observaciones"></textarea>

        <button type="submit">Crear Sondeo</button>
      </form>
    </div>
  );
});

export default NuevoSondeo;
