import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { login, logout, register } from '../auth-manager';
import { app } from '../firebase-config';

const AuthContext = createContext();
const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logout();
        setUser(null); // Forza il reset dello stato dell'utente
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout: handleLogout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);