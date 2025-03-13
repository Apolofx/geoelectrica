import { test, expect, describe, beforeEach } from "bun:test";
import { Medicion } from "../Medicion";
import { SondeoElectrico } from ".";
import { MedicionRepetidaError } from "../exceptions";

let sev: SondeoElectrico;
let today: Date;

beforeEach(() => {
  today = new Date();
  sev = new SondeoElectrico(
    "Buenos Aires",
    1,
    "casares",
    "Norte",
    "santo tomas",
    today,
    "123sur 123norte",
    "ninguna"
  );
});

describe("Un sondeo electrico", () => {
  test("debería crearse de forma completa", () => {
    const sevToJSON = sev.toJSON();
    expect(sevToJSON.provincia).toEqual("Buenos Aires");
    expect(sevToJSON.sevNro).toEqual(1);
    expect(sevToJSON.depto).toEqual("casares");
    expect(sevToJSON.rumbo).toEqual("Norte");
    expect(sevToJSON.zona).toEqual("santo tomas");
    expect(sevToJSON.fecha).toEqual(today);
    expect(sevToJSON.coordenadas).toEqual("123sur 123norte");
    expect(sevToJSON.observaciones).toEqual("ninguna");
  });

  test("debería permitir agregar mediciones", () => {
    const medicion1 = new Medicion(2, 2, 10, 10);
    const medicion2 = new Medicion(3, 2, 10, 10);
    sev.addMedicion(medicion1);
    sev.addMedicion(medicion2);
    const sevMediciones = sev.getMediciones();
    expect(sevMediciones.length).toEqual(2);
  });

  test("debería poder obtener una medición por ID", () => {
    const medicion1 = new Medicion(2, 2, 1, 10);
    const medicion2 = new Medicion(3, 2, 1, 10);
    sev.addMedicion(medicion1);
    sev.addMedicion(medicion2);
    const m1 = sev.getMedicionByID(medicion1.getID());
    expect(m1).toEqual(medicion1);
  });

  test("no debería permitir agregar mediciones repetidas", () => {
    const medicion1 = new Medicion(2, 2, 10, 10);
    sev.addMedicion(medicion1);
    expect(() => sev.addMedicion(medicion1)).toThrow(MedicionRepetidaError);
  });

  test("debería permitir borrar solo la ultima medicion efectuada", () => {
    const medicion1 = new Medicion(2, 2, 10, 10);
    const medicion2 = new Medicion(3, 2, 10, 10);
    sev.addMedicion(medicion1);
    sev.addMedicion(medicion2);
    sev.removeLastMedicion();
    expect(sev.getMediciones().length).toEqual(1);
  });
  test("debería permitir informar si existen o no mediciones realizadas", () => {
    const medicion1 = new Medicion(2, 2, 10, 10);
    const medicion2 = new Medicion(3, 2, 10, 10);
    sev.addMedicion(medicion1);
    sev.addMedicion(medicion2);
    expect(sev.hasMediciones()).toEqual(true);
    sev.removeLastMedicion();
    sev.removeLastMedicion();
    expect(sev.hasMediciones()).toEqual(false);
  });
  test("debería poder obtener los parametros iniciales de la siguiente medicion", () => {
    const medicion1 = new Medicion(2, 2, 10, 10);
    const medicion2 = new Medicion(3, 2, 10, 10);
    sev.addMedicion(medicion1);
    sev.addMedicion(medicion2);
    expect(sev.getNextMedicionParams()).toEqual({ a_b_sobre2: 4, mn: 2 });
    sev.removeLastMedicion();
    sev.removeLastMedicion();
    expect(sev.getNextMedicionParams()).toEqual({ a_b_sobre2: 2, mn: 2 });
  });
});
