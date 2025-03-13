# Descripcion del dominio

## Tenemos un historial de Estudios de geoeléctrica para el cual vamos a tener:

- El historial propiamente dicho (Lista de estudios)
- Cada estudio va a tener una lista de uno o mas sondeos electricos verticales (SEV)
- Cada SEV va a tener una o mas mediciones

## Interfaz del Historial de Estudios:

- Listar Estudios ✅
  Por cada estudio:
  - Borrar Estudio ✅
  - Ver estudio ✅
    - Listar sondeos ✅
      Por cada sondeo
      - Borrar Sondeo ✅
      - Ver sondeo ✅
        - Listar mediciones ✅
        - Borrar ultima medicion ✅
            Por cada medicion
            - Ver medicion
            - Editar parametros
        - Graficar curva
        - Borrar todas las mediciones de un sondeo (resetear sondeo)
        - Nueva medicion ✅
  - Nuevo Sondeo Electrico ✅
- Nuevo Estudio ✅


Como usuario debería poder crear un nuevo Estudio
    Una vez creado el nuevo estudio debería poder comenzar a agregarle mediciones inmediatamente
Como usuario debería poder editar los datos basicos de un estudio
Como usuario debería poder agregar un nuevo sondeo a un estudio ya creado
Como usuario debería poder visualizar todos los sondeos realizados nuevo Estudio
Como usuario debería poder editar un sondeo
Como usuario debería poder agregar nuevas mediciones a un sondeo
Como usuario debería poder borrar mediciones en un sondeo
Como usuario debería poder editar una medicion en un sondeo 