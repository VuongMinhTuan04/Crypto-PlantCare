import { createContext, useContext, useEffect, useState } from "react";

// Tạo Context
const AuthContext = createContext();

// Tạo Provider
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
