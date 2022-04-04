import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [userName, setUserName] = useState('');
    return (
        <AuthContext.Provider value={{ auth, setAuth, userName, setUserName }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
