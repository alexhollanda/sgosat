import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './paginas/Home/Home';
import { Usuarios } from './paginas/Usuarios/Usuarios';
import { NovoUsuario } from './paginas/Usuarios/NovoUsuario';
import { EditarUsuario } from './paginas/Usuarios/EditarUsuario';
import { Clientes } from './paginas/Clientes/Clientes';
import { NovoCliente } from './paginas/Clientes/NovoCliente';
import { EditarCliente } from './paginas/Clientes/EditarCliente';
import { OrdensServico } from './paginas/OrdensServico/OrdensServico';
import { NovaOrdemServico } from './paginas/OrdensServico/NovaOrdemServico';
import { Funcionarios } from './paginas/Funcionarios/Funcionarios';
import { NovoFuncionario } from './paginas/Funcionarios/NovoFuncionario';
import { EditarFuncionario } from './paginas/Funcionarios/EditarFuncionario';
import { AlterarSenha } from './paginas/Usuarios/AlterarSenha';
import { EditarOrdemServico } from './paginas/OrdensServico/EditarOrdemServico';
import Login from './paginas/Login/Login';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/clientes/novo" element={<PrivateRoute><NovoCliente /></PrivateRoute>} />
        <Route path="/clientes/editar" element={<PrivateRoute><EditarCliente /></PrivateRoute>} />
        <Route path="/funcionarios" element={<PrivateRoute><Funcionarios /></PrivateRoute>} />
        <Route path="/funcionarios/novo" element={<PrivateRoute><NovoFuncionario /></PrivateRoute>} />
        <Route path="/funcionarios/editar" element={<PrivateRoute><EditarFuncionario /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        <Route path="/usuarios/novo" element={<PrivateRoute><NovoUsuario /></PrivateRoute>} />
        <Route path="/usuarios/editar" element={<PrivateRoute><EditarUsuario /></PrivateRoute>} />
        <Route path="/usuarios/alterarsenha" element={<PrivateRoute><AlterarSenha /></PrivateRoute>} />
        <Route path="/ordens" element={<PrivateRoute><OrdensServico /></PrivateRoute>} />
        <Route path='/ordens/nova' element={<PrivateRoute><NovaOrdemServico /></PrivateRoute>} />
        <Route path='/ordens/editar' element={<PrivateRoute><EditarOrdemServico /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
