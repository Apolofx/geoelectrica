import { action, autorun, makeObservable, observable } from "mobx";
import { Estudio } from "../Estudio";
import { EstudioNotFoundError } from "../exceptions";
import { SondeoElectrico } from "../SondeoElectrico";
import { Medicion } from "../Medicion";

export abstract class HistorialDeEstudios {
  abstract addEstudio(estudio: Estudio): Estudio[];
  abstract removeEstudioPorID(id: string): Estudio[];
  abstract getEstudioPorID(id: string): Estudio;
  abstract getEstudios(): Estudio[];
}

export class HistorialDeEstudiosBrowserPersistance extends HistorialDeEstudios {
  historial: Estudio[] = [];

  constructor(browserPersistance: WindowLocalStorage) {
    super();
    const { localStorage } = browserPersistance;
    //TODO refactor this, localStorage should be passed as DI
    const initValues = JSON.parse(localStorage.getItem("historial") || "[]");
    this.historial = this.fromJSON(initValues);
    makeObservable(this, {
      historial: observable,
      addEstudio: action,
      removeEstudioPorID: action,
    });
    autorun(() => {
      localStorage.setItem("historial", JSON.stringify(this.toJSON()));
    });
  }

  getEstudios(): Estudio[] {
    return this.historial;
  }
  getEstudioPorID(id: string): Estudio {
    const estudio = this.getEstudios().find(
      (estudio) => estudio.getID() === id
    );
    if (!estudio) throw new EstudioNotFoundError(id);
    return estudio;
  }

  addEstudio(estudio: Estudio): Estudio[] {
    this.historial.push(estudio);
    return this.getEstudios();
  }
  removeEstudioPorID(id: string): Estudio[] {
    this.historial = this.historial.filter((estudio) => estudio.getID() !== id);
    return this.getEstudios();
  }

  toJSON() {
    return this.historial.map((estudio) => estudio.toJSON());
  }
  fromJSON(json: ReturnType<Estudio["toJSON"]>[]) {
    return json.map((estudio) => {
      return new Estudio(
        estudio.nombre_cliente,
        new Date(estudio.fecha),
        estudio.zona,
        estudio.id,
        estudio.sondeos.map(
          (sondeo) =>
            new SondeoElectrico(
              sondeo.provincia,
              sondeo.sevNro,
              sondeo.depto,
              sondeo.rumbo,
              sondeo.zona,
              new Date(sondeo.fecha),
              sondeo.coordenadas,
              sondeo.observaciones,
              sondeo.mediciones.map(
                (medicion) =>
                  new Medicion(
                    medicion.a_b_sobre2,
                    medicion.mn,
                    medicion.intensidad,
                    medicion.tension
                  )
              )
            )
        )
      );
    });
  }
}
