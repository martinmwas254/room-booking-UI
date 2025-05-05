import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });


  const login = (data) => {
    const userData = {
      username: data.user.username,
      isAdmin: data.user.isAdmin,
      token: data.token,
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
