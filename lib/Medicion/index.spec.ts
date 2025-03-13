import { test, expect, describe, beforeEach } from "bun:test";
import { Medicion } from ".";

describe("Una medicion", () => {
  test("debería crearse de forma completa", () => {
    const medicion = new Medicion(2, 2, 10, 10);
    const medicionToJSON = medicion.toJSON();
    expect(medicionToJSON.a_b_sobre2).toEqual(2);
    expect(medicionToJSON.mn).toEqual(2);
    expect(medicionToJSON.tension).toEqual(10);
    expect(medicionToJSON.intensidad).toEqual(10);
  });

  test("debería calcular la resistividad aparente de forma correcta", () => {
    const A_B_SOBRE2 = 1;
    const MN = 1;
    const TENSION = 1;
    const INTENSIDAD = 1;
    const medicion = new Medicion(A_B_SOBRE2, MN, INTENSIDAD, TENSION);
    expect(medicion.getResistividadAparente()).toEqual(Math.PI);
  });
});
