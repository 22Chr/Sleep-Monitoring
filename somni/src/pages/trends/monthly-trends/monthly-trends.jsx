import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../utilities/components/auth-context';
import { getSleepData } from '../../../utilities/get-db-data';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    parseISO,
    isSameMonth,
} from 'date-fns';
import SleepBarChart from '../../../utilities/components/graphs/barcharts';
import MonthlyNavbar from '../../../utilities/components/navbar/monthly-trends-navbar';
import '../trends.css';

function MonthlyTrends() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [monthlyData, setMonthlyData] = useState([]);

    // Verifica che l'utente sia loggato
    useEffect(() => {
        if (!user) {
            alert('You must be logged in to see the Monthly Trends');
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cachedData = localStorage.getItem('sleepData');
                const cachedTime = localStorage.getItem('sleepDataTimestamp');
                const TEN_MINUTES = 1000 * 60 * 10;
    
                if (cachedData && cachedTime && Date.now() - cachedTime < TEN_MINUTES) {
                    // Dati presenti e recenti: li usiamo
                    const parsedData = JSON.parse(cachedData);
                    const filteredData = filterCurrentMonthData(parsedData);
                    setMonthlyData(filteredData);
                } else {
                    // Dati non presenti o scaduti: fetch + cache
                    const sleepData = await getSleepData();
                    localStorage.setItem('sleepData', JSON.stringify(sleepData));
                    localStorage.setItem('sleepDataTimestamp', Date.now().toString());
                    const filteredData = filterCurrentMonthData(sleepData);
                    setMonthlyData(filteredData);
                }
            } catch (error) {
                console.error("Errore nel recupero dati:", error);
                alert('An error has occured while fetching data');
            }
        };
    
        fetchData();
    }, []);

    const filterCurrentMonthData = (sleepData) => {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());

        // Inizializza tutti i giorni del mese con oggetti per conteggio e sonno
        const groupedData = eachDayOfInterval({ start, end }).reduce((acc, date) => {
            acc[format(date, 'dd/MM')] = { totalSleep: 0, deep: 0, rem: 0, awake: 0, count: 0 };
            return acc;
        }, {});

        sleepData.forEach((entry) => {
            const entryDate = parseISO(entry.timestamp);
            if (isSameMonth(entryDate, start)) {
                const day = format(entryDate, 'dd/MM');
                groupedData[day].totalSleep += entry.duration; // Somma il tempo totale di sonno
                if (entry.sleepStage === 'Deep') groupedData[day].deep++;
                if (entry.sleepStage === 'REM') groupedData[day].rem++;
                if (entry.sleepStage === 'Awake') groupedData[day].awake++;
                groupedData[day].count++; // Incrementa il conteggio
            }
        });

        // Convertiamo in array ordinato per Recharts
        return Object.keys(groupedData).map((day) => ({
            day,
            totalSleep: groupedData[day].totalSleep,
            deep: groupedData[day].deep,
            rem: groupedData[day].rem,
            awake: groupedData[day].awake,
            count: groupedData[day].count, // Include il campo count che serve a recharts
        }));
    };

    let totalSQI = 0;
    let validDays = 0;

    monthlyData.forEach(({ totalSleep, deep, rem, awake }) => {
        if (totalSleep > 0) { // Evitiamo divisioni per zero
            const punteggioDurata = (totalSleep / (8 * 60)) * 100; // Durata del sonno
            const punteggioFase = ((deep + rem) / totalSleep) * 100; // Fasi del sonno (Deep + REM)
            const punteggioRisvegli = (awake / totalSleep) * 100; // Risvegli

            // Calcoliamo il SQI
            const sleepQuality = Math.floor(punteggioDurata * 0.5 + punteggioFase * 0.5 - punteggioRisvegli);

            totalSQI += sleepQuality;
            validDays++;
        }
    });

    const averageSQI = validDays > 0 ? Math.floor(totalSQI / validDays) : 0;

    return (
        <div>
            <MonthlyNavbar />
            <SleepBarChart data={monthlyData} />
            {validDays > 0 && averageSQI > 0 && (
                <div>
                    <h1 className='avarage-sleep'>
                        On average, your SQI this month is {averageSQI}
                    </h1>
                </div>
            )}
        </div>
    );
}

export default MonthlyTrends;
