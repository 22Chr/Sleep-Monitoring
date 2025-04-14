import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../utilities/components/auth-context';
import { getSleepData } from '../../../utilities/get-db-data';
import { format, startOfWeek, isSameWeek, parseISO, addDays } from 'date-fns';
import SleepBarChart from '../../../utilities/components/graphs/barcharts';
import WeeklyNavbar from '../../../utilities/components/navbar/weekly-trends-navbar';
import '../trends.css';

function WeeklyTrends() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        if (!user) {
            alert('You must be logged in to see the Weekly Trends');
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
                    // Se i dati sono in cache e recenti
                    const parsedData = JSON.parse(cachedData);
                    const filteredData = filterCurrentWeekData(parsedData);
                    setWeeklyData(filteredData);
                } else {
                    // Altrimenti fai il fetch
                    const sleepData = await getSleepData();
                    localStorage.setItem('sleepData', JSON.stringify(sleepData));
                    localStorage.setItem('sleepDataTimestamp', Date.now().toString());
                    const filteredData = filterCurrentWeekData(sleepData);
                    setWeeklyData(filteredData);
                }
            } catch (error) {
                console.error("Errore nel recupero dati:", error);
                alert('An error has occured while fetching data');
            }
        };
    
        fetchData();
    }, []);

    const filterCurrentWeekData = (sleepData) => {
        const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lunedì come inizio settimana
        const groupedData = {};

        for (let i = 0; i < 7; i++) {
            const date = addDays(startOfCurrentWeek, i);
            groupedData[format(date, 'EEEE, dd/MM')] = { totalSleep: 0, deep: 0, rem: 0, awake: 0, count: 0 };
        }

        sleepData.forEach((entry) => {
            const entryDate = parseISO(entry.timestamp);

            if (isSameWeek(entryDate, startOfCurrentWeek, { weekStartsOn: 1 })) {
                const day = format(entryDate, 'EEEE, dd/MM');

                if (groupedData[day]) {
                    groupedData[day].totalSleep += entry.duration; // Somma il tempo totale di sonno
                    if (entry.sleepStage === 'Deep') groupedData[day].deep++;
                    if (entry.sleepStage === 'REM') groupedData[day].rem++;
                    if (entry.sleepStage === 'Awake') groupedData[day].awake++;
                    groupedData[day].count++; // Incrementa il conteggio
                }
            }
        });

        // Ora includiamo anche `count` nell'oggetto che viene restituito
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

    weeklyData.forEach(({ totalSleep, deep, rem, awake }) => {
        if (totalSleep > 0) { // Evitiamo divisioni per zero
            const punteggioDurata = (totalSleep / (8 * 60)) * 100;
            const punteggioFase = ((deep + rem) / totalSleep) * 100;
            const punteggioRisvegli = (awake / totalSleep) * 100;
            const sleepQuality = Math.floor(punteggioDurata * 0.5 + punteggioFase * 0.5 - punteggioRisvegli);

            totalSQI += sleepQuality;
            validDays++;
        }
    });

    const averageSQI = validDays > 0 ? Math.floor(totalSQI / validDays) : 0;

    return (
        <div>
            <WeeklyNavbar />
            <SleepBarChart data={weeklyData} />
            {validDays > 0 ? (
                <div>
                    <h1 className='avarage-sleep'>This week, your average SQI is {averageSQI}</h1>
                </div>
            ) : null}
        </div>
    );
}

export default WeeklyTrends;
