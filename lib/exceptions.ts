class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

class MedicionRepetidaError extends CustomError {
  constructor() {
    super("La medición ya existe.");
  }
}

class EstudioNotFoundError extends CustomError {
  constructor(id = "") {
    super(`El estudio con ID: ${id} no existe`);
  }
}

class EstudioEmptySondeos extends CustomError {
  constructor(id = "") {
    super(`El estudio con ID: ${id} no tiene sondeos`);
  }
}

class SondeoNotFound extends CustomError {
  constructor(id = "") {
    super(`El sondeo con ID: ${id} no existe`);
  }
}

export {
  CustomError,
  MedicionRepetidaError,
  EstudioNotFoundError,
  EstudioEmptySondeos,
  SondeoNotFound
};
