import { observer } from "mobx-react-lite";
import { Estudio } from "lib";
import store from "store";
import { useNavigate } from "react-router";
import { PageLayout } from "components";
/**
 * Esta vista se encarga de crear un nuevo estudio de geoelectrica:
 */
const ARG_TZ_OFFSET = -3;

const NuevoEstudio = observer(() => {
  const { historialDeEstudios } = store;
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const cliente = formData.get("name") as string;
    const fecha = new Date(formData.get("date") as string);
    const zona = formData.get("zone") as string;
    fecha.setHours(fecha.getHours() - ARG_TZ_OFFSET);
    const estudio = new Estudio(cliente, fecha, zona);
    historialDeEstudios.addEstudio(estudio);
    navigate(`/e/${estudio.getID()}`);
  };
  return (
    <PageLayout>
      <h1>Nuevo Estudio</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <label htmlFor="name">Cliente</label>
        <input type="text" id="name" name="name" required />
        <label htmlFor="date">Fecha</label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={setDefaultDate()}
        />
        <label htmlFor="zone">Zona</label>
        <input type="text" id="zone" name="zone" required />
        <button type="submit">Crear</button>
      </form>
    </PageLayout>
  );
});
export default NuevoEstudio;

function setDefaultDate() {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}
