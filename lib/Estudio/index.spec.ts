import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { Estudio } from "./index";
import { SondeoElectrico } from "../SondeoElectrico";
import { EstudioEmptySondeos } from "../exceptions";

let estudio: Estudio;
let sondeo1: SondeoElectrico;
let sondeo2: SondeoElectrico;
let today: Date;
beforeEach(() => {
  today = new Date("2025-03-03");
  estudio = new Estudio("Cliente A", today, "Zona Norte");
  sondeo1 = new SondeoElectrico(
    "Buenos Aires",
    1,
    "casares",
    "Norte",
    "santo tomas",
    new Date(),
    "123sur 123norte",
    "ninguna"
  );
  sondeo2 = new SondeoElectrico(
    "Cordoba",
    2,
    "capital",
    "Sur",
    "zona centro",
    new Date(),
    "456este 456oeste",
    "observacion 1"
  );
});

afterEach(() => {
  estudio.emptySondeos();
});

describe("Un estudio", () => {
  test("debería crearse de forma completa", () => {
    const estudioToJSON = estudio.toJSON();
    expect(estudioToJSON.nombre_cliente).toEqual("Cliente A");
    expect(estudioToJSON.fecha).toEqual(today);
    expect(estudioToJSON.zona).toEqual("Zona Norte");
    expect(estudioToJSON.sondeos).toEqual([]);
  });

  test("debería permitir agregar sondeos", () => {
    estudio.addSondeo(sondeo1);
    estudio.addSondeo(sondeo2);
    const sondeos = estudio.getSondeos();
    expect(sondeos.length).toEqual(2);
  });

  test("debería permitir eliminar el último sondeo", () => {
    estudio.addSondeo(sondeo1);
    estudio.addSondeo(sondeo2);
    estudio.removeLastSondeo();
    const sondeos = estudio.getSondeos();
    expect(sondeos.length).toEqual(1);
    expect(sondeos[0]).toEqual(sondeo1);
  });

  test("debería permitir eliminar un sondeo por ID", () => {
    estudio.addSondeo(sondeo1);
    estudio.addSondeo(sondeo2);
    estudio.removeSondeoByID(sondeo1.getID());
    const sondeos = estudio.getSondeos();
    expect(sondeos.length).toEqual(1);
    expect(sondeos[0]).toEqual(sondeo2);
  });

  test("debería poder obtener un sondeo por ID", () => {
    estudio.addSondeo(sondeo1);
    estudio.addSondeo(sondeo2);
    const sondeo = estudio.getSondeoByID(sondeo1.getID());
    expect(sondeo).toEqual(sondeo1);
  });

  test("debería convertir el estudio a JSON correctamente", () => {
    estudio.addSondeo(sondeo1);
    estudio.addSondeo(sondeo2);
    const estudioToJSON = estudio.toJSON();
    expect(estudioToJSON).toEqual({
      nombre_cliente: "Cliente A",
      fecha: today,
      zona: "Zona Norte",
      id: estudio.getID(),
      sondeos: [sondeo1.toJSON(), sondeo2.toJSON()],
    });
  });

  test("debería poder obtener el ultimo sondeo realizado", () => {
    estudio.addSondeo(sondeo1);
    estudio.addSondeo(sondeo2);
    const lastSondeo = estudio.getLastSondeo();
    expect(lastSondeo).toEqual(sondeo2);
  });

  test("debería retornar un error si se intenta obtener el ultimo sondeo y no existe", () => {
    expect(() => estudio.getLastSondeo()).toThrow(EstudioEmptySondeos);
  });

  test("debería poder obtener un sondeo por su numero ordinal (SevNro)", () => {
    estudio.addSondeo(sondeo1);
    estudio.addSondeo(sondeo2);
    const sondeo = estudio.getSondeoBySevNro(sondeo1.getSevNro());
    expect(sondeo).toEqual(sondeo1);
  });

  test("debería poder obtener el numero del siguiente sondeo a realizar", () => {
    estudio.addSondeo(sondeo1);
    estudio.addSondeo(sondeo2);
    const nextSevNro = estudio.getNextSevNro();
    expect(nextSevNro).toEqual(3);
  });
});
