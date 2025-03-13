import { HistorialDeEstudiosBrowserPersistance } from "lib";

// Inicializa el historial de estudios desde la capa persistente (DB, Browser LS, Disk LS, etc)
const historialDeEstudios = new HistorialDeEstudiosBrowserPersistance(window);

const store = {
  historialDeEstudios,
};

export default store;
