export class Medicion {
  constructor(
    private readonly a_b_sobre2: number,
    private mn: number,
    private intensidad: number,
    private tension: number
  ) {}
  toJSON() {
    return {
      a_b_sobre2: this.a_b_sobre2,
      mn: this.mn,
      intensidad: this.intensidad,
      tension: this.tension,
      resistividad_aparente: this.getResistividadAparente(),
      id: this.getID(),
    };
  }
  getID() {
    return this.a_b_sobre2;
  }
  getResistividadAparente() {
    return (
      ((this.tension / this.intensidad) * Math.PI * this.a_b_sobre2 ** 2) /
      this.mn
    );
  }
  getA_B_Sobre2() {
    return this.a_b_sobre2;
  }
  getMN() {
    return this.mn;
  }
  getIntensidad() {
    return this.intensidad;
  }
  getTension() {
    return this.tension;
  }
}
