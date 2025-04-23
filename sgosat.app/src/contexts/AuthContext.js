import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  const login = (usuarioData) => {
    setUsuario(usuarioData);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);