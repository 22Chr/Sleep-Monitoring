import { useState } from 'react';
import { db } from '../firebase-config';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Papa from 'papaparse';
import '../../pages/login/login.css'

function CsvUploader({onUploadSuccess}) {
    const [file, setFile] = useState(null);
    const auth = getAuth(); //recupera l'istanza di Firebase Auth

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadCsv = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const user = auth.currentUser; //recupera l'utente autenticato
        if (!user) {
            alert('You must be logged in to upload data');
            return;
        }

        const userID = user.uid; //ottiene l'identificativo unico dell'utente loggato
        const sleepDataCollection = collection(db, 'sleepData', userID, 'entries');

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                let duplicateCount = 0;

                for (const row of result.data) {
                    const timestamp = row['Timestamp'];
                    const sleepStage = row['Sleep Stage'];

                    if (!timestamp || !sleepStage) {
                        console.warn('Skipping row with missing data:', row);
                        continue;
                    }

                    const docRef = doc(sleepDataCollection, timestamp);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        duplicateCount++;
                    } else {
                        await setDoc(docRef, {
                            userID,
                            timestamp,
                            sleepStage,
                            createdAt: new Date()
                        });
                    }
                }

                if (duplicateCount > 0) {
                    alert(`${duplicateCount} entries were already in the database and were skipped.`);
                } else {
                    alert('CSV data successfully uploaded!');
                }
                onUploadSuccess(); //comunica al componente Login che l'upload è completato 
            }
        });
    };

    return (
        <div className="uploader">
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <button onClick={uploadCsv}>Upload</button>
        </div>
    );
}

export default CsvUploader;
