import { render } from "preact";
import "./index.css";
import { App } from "./app";
import { BrowserRouter, Routes, Route } from "react-router";
import NuevoEstudio from "./app/estudio/create";
import EditEstudio from "./app/estudio/edit";
import ViewEstudio from "./app/estudio/view";
import NuevoSondeo from "./app/sondeo/create";
import ViewSondeo from "./app/sondeo/view";
import NuevaMedicion from "./app/medicion";

render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/e/create" element={<NuevoEstudio />} />
      <Route path="/e/:eid" element={<ViewEstudio />} />
      <Route path="/e/:eid/edit" element={<EditEstudio />} />
      <Route path="/e/:eid/s/create" element={<NuevoSondeo />} />
      <Route path="/e/:eid/s/:sid" element={<ViewSondeo />} />
      <Route
        path="/e/:eid/s/:sid/m/create"
        element={<NuevaMedicion />}
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById("app")!
);
