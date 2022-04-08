import { createContext, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({});
    const [userName, setUserName] = useState('');
    return (
        <AuthContext.Provider value={{
            auth, setAuth, userName, setUserName,
        }}
      >
            {children}
      </AuthContext.Provider>
    );
}

export default AuthContext;
