import { makeAutoObservable } from "mobx";
import { SondeoElectrico } from "../SondeoElectrico";
import { EstudioEmptySondeos, SondeoNotFound } from "../exceptions";
/**
 * + sondeos: SondeoElectrico[]
 * +
 */
export class Estudio {
  constructor(
    private nombre_cliente: string,
    private fecha: Date,
    private zona: string,
    private id = crypto.randomUUID(),
    private sondeos: SondeoElectrico[] = []
  ) {
    makeAutoObservable(this);
  }

  getCliente() {
    return this.nombre_cliente;
  }

  getFecha() {
    return this.fecha;
  }

  getZona() {
    return this.zona;
  }

  getSondeos() {
    return this.sondeos;
  }

  getID() {
    return this.id;
  }

  hasSondeos() {
    return this.sondeos.length > 0;
  }

  getLastSondeo() {
    if (!this.hasSondeos()) throw new EstudioEmptySondeos(this.getID());
    return this.sondeos[this.sondeos.length - 1];
  }

  getNextSevNro() {
    if (!this.hasSondeos()) return 1;
    return this.getLastSondeo().getSevNro() + 1;
  }

  addSondeo(sondeo: SondeoElectrico) {
    this.sondeos.push(sondeo);
  }

  removeLastSondeo() {
    this.sondeos.pop();
  }

  emptySondeos() {
    this.sondeos = [];
  }

  removeSondeoByID(id: number) {
    this.sondeos = this.sondeos.filter((sondeo) => sondeo.getID() !== id);
  }

  getSondeoByID(id: number) {
    const sondeo = this.sondeos.find((sondeo) => sondeo.getID() === id);
    if (!sondeo) throw new SondeoNotFound();
    return sondeo;
  }

  getSondeoBySevNro(sevNro: number) {
    return this.sondeos.find((sondeo) => sondeo.getSevNro() === sevNro);
  }

  toJSON() {
    return {
      nombre_cliente: this.nombre_cliente,
      fecha: this.fecha,
      zona: this.zona,
      id: this.id,
      sondeos: this.sondeos.map((sondeo) => sondeo.toJSON()),
    };
  }
}

