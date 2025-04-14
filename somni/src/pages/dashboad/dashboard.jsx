import { useNavigate } from 'react-router';
import { useAuth } from '../../utilities/components/auth-context';
import { useState, useEffect, useMemo } from 'react';
import DashNavbar from '../../utilities/components/navbar/dashboard-navbar';
import { getSleepData } from '../../utilities/get-db-data';
import PieChart from '../../utilities/components/graphs/pie-chart';
import FormatData from '../../utilities/components/graphs/format-data';
import WeekNavigator from '../../utilities/components/week-selector/week-navigator';
import Hypnogram from '../../utilities/components/graphs/hypnogram';
import './dashboard.css';
import { format, parseISO } from 'date-fns';
import React from 'react';

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd')); // Formattiamo la data subito

    useEffect(() => {
        if (!user) {
            alert('You must be logged in to access the dashboard');
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            // Prova a leggere i dati dal localStorage
            const cachedData = localStorage.getItem('sleepData');
    
            if (cachedData) {
                // Se esiste, parse e setta
                setData(JSON.parse(cachedData));
            } else {
                // Altrimenti fai fetch, salva e setta
                const sleepData = await getSleepData();
                localStorage.setItem('sleepData', JSON.stringify(sleepData));
                setData(sleepData);
            }
        };
    
        fetchData();
    }, []);

    

    const byDateData = data.filter(({ timestamp }) => {
        const dateOnly = format(parseISO(timestamp), 'yyyy-MM-dd');
        return dateOnly === selectedDay;
    });

    // Calcolo tempo totale trascorso a letto
    const sleepTime = FormatData(byDateData);
    const totalSleptTime = sleepTime.reduce((acc, stamp) => acc + stamp.value, 0);
    const minutes = totalSleptTime % 60;
    const hours = Math.floor(totalSleptTime / 60);

    //CALCOLO PUNTEGGIO DEL SONNO
    const idealSleepTime = 8 * 60; //ore ideali in cui si dovrebbe dormire una notte
    let deep = 0; //tempo in sonno profondo
    let rem = 0; //tempo in fase REM
    let awake = 0; //tempo in cui l'utente è sveglio durante la notte

    //popola i vari tempi trascorsi in ogni fase
    byDateData.forEach((val) => {
        if (val.sleepStage === 'Deep') {
            deep++;
        }
        if (val.sleepStage === 'REM') {
            rem++;
        }
        if (val.sleepStage === 'Awake') {
            awake++;
        }
    });

    const punteggioDurata = (totalSleptTime / idealSleepTime) * 100;
    const punteggioFase = ((deep + rem) / totalSleptTime) * 100;
    const punteggioRisvegli = (awake / totalSleptTime) * 100;
    const sleepQuality = Math.floor(
        punteggioDurata * 0.5 + punteggioFase * 0.5 - punteggioRisvegli,
    );

    return user ? (
        <div>
            <DashNavbar />
            <div className="week-nav">
                <WeekNavigator onSelectDay={setSelectedDay} />
            </div>
            {data && byDateData.length === 0 && (
                <h1 className="waiting-for-data-message">Waiting for data...</h1>
            )}
            <div className="sleep-details">
                {data && byDateData.length > 0 && (
                    <h1>
                        You have slept {hours} hours{minutes !== 0 ? ` and ${minutes} minutes` : ''}{' '}
                        this night
                    </h1>
                )}
            </div>
            <div className="graph-box">
                <PieChart data={data} targetDay={selectedDay} />
            </div>
            <div className="hypnogram">
                <Hypnogram data={data} targetDay={selectedDay} />
            </div>
            {data && byDateData.length > 0 && (
                <div className="SQI">
                    <h1 className="sleep-quality">Sleep Quality Index</h1>
                    {sleepQuality >= 80 && sleepQuality <= 100 && (
                        <h1 id="perfect" className="punteggio">
                            {sleepQuality}
                        </h1>
                    )}
                    {sleepQuality >= 60 && sleepQuality <= 79 && (
                        <h1 id="good" className="punteggio">
                            {sleepQuality}
                        </h1>
                    )}
                    {sleepQuality >= 40 && sleepQuality <= 59 && (
                        <h1 id="poor" className="punteggio">
                            {sleepQuality}
                        </h1>
                    )}
                    {sleepQuality >= 0 && sleepQuality <= 39 && (
                        <h1 id="really-bad" className="punteggio">
                            {sleepQuality}
                        </h1>
                    )}
                </div>
            )}
        </div>
    ) : null;
}

export default Dashboard;
