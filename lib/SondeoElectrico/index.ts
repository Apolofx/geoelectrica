import { makeAutoObservable } from "mobx";
import { Medicion } from "../Medicion";
import { MedicionRepetidaError } from "../exceptions";

export class SondeoElectrico {
  static TABLA_A_B_SOBRE_2 = [
    2, 3, 4, 5, 6, 8, 10, 13, 16, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150,
    190, 240, 300, 400, 500,
  ];
  constructor(
    private provincia: string,
    private sevNro: number,
    private depto: string,
    private rumbo: string,
    private zona: string,
    private fecha: Date,
    private coordenadas: string,
    private observaciones: string,
    private mediciones: Medicion[] = []
  ) {
    makeAutoObservable(this);
  }

  // Getters
  getID() {
    return this.sevNro;
  }

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
  hasMediciones() {
    const mediciones = this.getMediciones();
    return Boolean(mediciones.length);
  }
  addMedicion(medicion: Medicion) {
    const duplicated = this.getMediciones().find(
      (m) => m.getID() === medicion.getID()
    );
    if (duplicated) throw new MedicionRepetidaError();
    this.mediciones.push(medicion);
  }

  getLastMedicion() {
    const sorted = this.getMediciones()
      .slice()
      .sort((m1, m2) => m1.getA_B_Sobre2() - m2.getA_B_Sobre2());
    return sorted.at(-1);
  }
  getNextMedicionParams() {
    const lastMedicion = this.getLastMedicion();
    if (!lastMedicion)
      return {
        a_b_sobre2: SondeoElectrico.TABLA_A_B_SOBRE_2[0],
      };
    const lastMedicionIndex = SondeoElectrico.TABLA_A_B_SOBRE_2.findIndex(
      (a_b_sobre2) => a_b_sobre2 === lastMedicion.getA_B_Sobre2()
    );
    const nextMedicionParams = {
      a_b_sobre2: SondeoElectrico.TABLA_A_B_SOBRE_2[lastMedicionIndex + 1],
    };
    return nextMedicionParams;
  }

  removeLastMedicion() {
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
