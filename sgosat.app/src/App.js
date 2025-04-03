import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './paginas/Home/Home';
import { Usuarios } from './paginas/Usuarios/Usuarios';
import { NovoUsuario } from './paginas/Usuarios/NovoUsuario';
import { EditarUsuario } from './paginas/Usuarios/EditarUsuario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuario/novo" element={<NovoUsuario />} />
        <Route path="/usuario/editar" element={<EditarUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
