# Brasaland Digital

Landing page y formulario de registro para Brasaland, cadena de restaurantes con operacion en Medellin (Colombia) y Florida (EE. UU.).

Este repositorio contiene una implementacion frontend estatica orientada a:

- Presentar la propuesta de valor de Brasaland.
- Capturar datos de clientes para el programa Brasa Points.
- Validar formularios con reglas de negocio en JavaScript vanilla.

## Estructura principal

- `index.html`: Landing principal de Brasaland.
- `application.html`: Formulario de registro.
- `validation.js`: Validaciones de cliente, mercado y campos de Brasa Points.
- `CONTEXT.md`: Contexto de negocio que define contenido y reglas del proyecto.

## Cómo ejecutar el proyecto localmente

Puedes levantar el proyecto en local o en Codespaces con este comando:

```bash
npx http-server . -p 3000 -a 0.0.0.0
```

Tambien puedes usar el script de npm:

```bash
npm run start
```

Luego abre el navegador en:

```text
http://localhost:3000
```

## Notas

- El proyecto es estatico y no requiere build.
- Para desarrollo en Codespaces, el host `0.0.0.0` permite exponer correctamente el puerto 3000.
