import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';

const getSleepData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        alert('No authenticated user');
        return [];
    }

    // Percorso della sottocollezione 'entries' dell'utente
    const sleepEntriesRef = collection(db, 'sleepData', user.uid, 'entries');

    try {
        const querySnapshot = await getDocs(sleepEntriesRef);
        let sleepRecords = [];

        // Recupera tutte le entry e le formatta
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            //recupera gli stadi del sonno
            const { sleepStage } = data;
            //recupera il timestamp di ogni entry
            const { timestamp } = data;

            // Ogni entry ha una durata di 60 secondi (1 minuto)
            const duration = 1; // Durata in minuti (60 secondi)

            // Aggiunge i dati con la durata di 60 secondi
            sleepRecords.push({ timestamp, sleepStage, duration });
        });

        return sleepRecords;
    } catch (error) {
        alert('Error fetching sleep data:', error);
        return [];
    }
};

export { getSleepData };
