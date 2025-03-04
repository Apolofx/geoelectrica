import { Medicion } from "../Medicion";
import { MedicionRepetidaError } from "../exceptions";

export class SondeoElectrico {
  private mediciones: Medicion[] = [];
  constructor(
    private provincia: string,
    private sevNro: number,
    private depto: string,
    private rumbo: string,
    private zona: string,
    private fecha: Date,
    private coordenadas: string,
    private observaciones: string
  ) {}

  // Getters
  getProvincia() {
    return this.provincia;
  }

  getSevNro() {
    return this.sevNro;
  }

  getDepto() {
    return this.depto;
  }

  getRumbo() {
    return this.rumbo;
  }

  getZona() {
    return this.zona;
  }

  getFecha() {
    return this.fecha;
  }

  getCoordenadas() {
    return this.coordenadas;
  }

  getObservaciones() {
    return this.observaciones;
  }

  getMediciones() {
    return this.mediciones;
  }

  addMedicion(medicion: Medicion) {
    const duplicated = this.getMediciones().find(
      (m) => m.getID() === medicion.getID()
    );
    if (duplicated) throw new MedicionRepetidaError();
    this.mediciones.push(medicion);
  }

  removeLastMedicion(_medicion: Medicion) {
    this.mediciones.pop();
  }
  getMedicionByID(id: string) {
    const medicion = this.getMediciones().find((m) => m.getID() === id);
    return medicion;
  }
  toJSON() {
    return {
      provincia: this.provincia,
      sevNro: this.sevNro,
      depto: this.depto,
      rumbo: this.rumbo,
      zona: this.zona,
      fecha: this.fecha,
      coordenadas: this.coordenadas,
      observaciones: this.observaciones,
      mediciones: this.mediciones.map((medicion) => medicion.toJSON()),
    };
  }
}
