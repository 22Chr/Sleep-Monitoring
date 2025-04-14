// firebaseAuth.js
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { app, db } from './firebase-config';
import { doc, setDoc } from 'firebase/firestore';

const auth = getAuth(app);

//funzione per registrare un nuovo utente
const register = async (email, password, name, surname) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            email: email,
            name: name,
            surname: surname,
            createdAt: new Date()
        });

        console.log(`New user ${user} has been succesfully registered`);
        return user;
    } catch (error) {
        console.error('Unable to register the new user:', error.message);
        return null;
    }
}

// Funzione per effettuare il login
const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Errore di login:', error.message);
        return null;
    }
};

// Funzione per il logout
const logout = async () => {
    await signOut(auth);
};

export { register, login, logout };
