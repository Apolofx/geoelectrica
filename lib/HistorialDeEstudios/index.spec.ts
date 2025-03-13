import { test, expect, describe, beforeEach, afterEach, mock } from "bun:test";
import { Estudio } from "../Estudio";
import { HistorialDeEstudiosBrowserPersistance } from "./index";
import { EstudioNotFoundError } from "../exceptions";
import { SondeoElectrico } from "../SondeoElectrico";

let historial: HistorialDeEstudiosBrowserPersistance;
let estudio1: Estudio;
let estudio2: Estudio;
const today = new Date("2025-03-03");
const mockWindowLocalStorage = {
  localStorage: {
    items: {},
    setItem(key: string, value: string) {
      this.items[key] = value;
    },
    getItem(key: string) {
      return this.items[key];
    },
    clear() {
      this.items = {};
    },
    removeItem(key: string) {
      delete this.items[key];
    },
    get length(): number {
      return Object.keys(this.items).length;
    },
    key(index: number): string | null {
      return Object.keys(this.items)[index] || null;
    },
  },
};

beforeEach(() => {
  historial = new HistorialDeEstudiosBrowserPersistance(mockWindowLocalStorage);
  estudio1 = new Estudio("Cliente A", today, "Zona Norte");
  estudio2 = new Estudio("Cliente B", today, "Zona Sur");
});
afterEach(() => {
  mockWindowLocalStorage.localStorage.clear();
});

describe("HistorialDeEstudiosBrowserPersistance", () => {
  test("debería crearse de forma vacía", () => {
    const estudios = historial.getEstudios();
    expect(estudios.length).toEqual(0);
  });

  test("debería permitir agregar estudios", () => {
    historial.addEstudio(estudio1);
    historial.addEstudio(estudio2);
    const estudios = historial.getEstudios();
    expect(estudios.length).toEqual(2);
  });

  test("debería permitir eliminar un estudio por ID", () => {
    historial.addEstudio(estudio1);
    historial.addEstudio(estudio2);
    historial.removeEstudioPorID(estudio1.getID());
    const estudios = historial.getEstudios();
    expect(estudios.length).toEqual(1);
    expect(estudios[0].getID()).toEqual(estudio2.getID());
  });

  test("debería poder obtener un estudio por ID", () => {
    historial.addEstudio(estudio1);
    historial.addEstudio(estudio2);
    const estudio = historial.getEstudioPorID(estudio1.getID());
    expect(estudio).toEqual(estudio1);
  });

  test("debería lanzar una excepcion si un estudio no se encuentra", () => {
    expect(() => historial.getEstudioPorID("no-existe")).toThrow(
      EstudioNotFoundError
    );
  });

  test("debería sincronizarse con cada nuevo cambio en un estudio", () => {
    historial.addEstudio(estudio1);
    const nuevoSondeo = new SondeoElectrico(
      "buenos aires",
      1,
      "depto",
      "rumbo",
      "zona",
      new Date(),
      "coordenadas",
      "observaciones"
    );
    estudio1.addSondeo(nuevoSondeo);
    const storedSondeo = historial
      .getEstudioPorID(estudio1.getID())
      .getSondeoByID(nuevoSondeo.getID())
      ?.toJSON();
    expect(storedSondeo).toEqual(nuevoSondeo.toJSON());
  });
});
