import { createContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/authAPI.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restore = async () => {
            try {
                const existingToken = localStorage.getItem('token');
                if (!existingToken) {
                    setUser(null);
                    return;
                }
                const data = await authAPI.me(existingToken);
                setUser(data.user);
                setToken(existingToken);
            } catch (e) {
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };
        restore();
    }, []);

    const value = useMemo(() => {
        return {
            token,
            user,
            loading,
            login: ({ token: newToken, user: newUser }) => {
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(newUser);
            },
            logout: () => {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        };
    }, [token, user, loading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

