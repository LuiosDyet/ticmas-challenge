import { React, createContext, useState } from 'react';

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({});
    const [userName, setUserName] = useState('');
    return (
        <AuthContext.Provider
            // -- this needs further looking and useMemo()
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                auth,
                setAuth,
                userName,
                setUserName,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
