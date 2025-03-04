class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class MedicionRepetidaError extends CustomError {
  constructor() {
    super("La medición ya existe.");
  }
}

export { CustomError, MedicionRepetidaError };
