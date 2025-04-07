import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './paginas/Home/Home';
import { Usuarios } from './paginas/Usuarios/Usuarios';
import { NovoUsuario } from './paginas/Usuarios/NovoUsuario';
import { EditarUsuario } from './paginas/Usuarios/EditarUsuario';
import { Clientes } from './paginas/Clientes/Clientes';
import { NovoCliente } from './paginas/Clientes/NovoCliente';
import { EditarCliente } from './paginas/Clientes/EditarCliente';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/novo" element={<NovoCliente />} />
        <Route path="/clientes/editar" element={<EditarCliente />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/novo" element={<NovoUsuario />} />
        <Route path="/usuarios/editar" element={<EditarUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
