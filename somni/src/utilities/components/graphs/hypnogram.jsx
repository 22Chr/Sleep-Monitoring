import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, differenceInMinutes, addMinutes } from 'date-fns';
import '../../../pages/dashboad/dashboard.css';

const SLEEP_PHASES = ['Light', 'Deep', 'REM', 'Awake'];

const Hypnogram = ({ data, targetDay }) => {
    if (!data) {
        alert('Missing data');
        return <h1>No data is available</h1>;
    }

    if (!targetDay) {
        alert('Missing target day');
    }

    // Filtra i dati per la data selezionata
    const hypnoData = data
        .filter(({ timestamp }) => format(parseISO(timestamp), 'yyyy-MM-dd') === targetDay)
        .map(({ timestamp, sleepStage }) => ({
            time: parseISO(timestamp),
            phase: SLEEP_PHASES.indexOf(sleepStage),
        }));

    if (hypnoData.length === 0) {
        return null;
    }

    // Determina l'ora di inizio e fine del sonno
    const startTime = hypnoData[0].time;
    const endTime = hypnoData[hypnoData.length - 1].time;
    const totalMinutes = differenceInMinutes(endTime, startTime);
    const intervalMinutes = totalMinutes / 4; // 4 intervalli per 5 etichette

    // Genera le etichette a intervalli regolari
    const xTicks = Array.from({ length: 5 }, (_, i) =>
        format(addMinutes(startTime, intervalMinutes * i), 'HH:00')
    );

    return (
        <div className="hypnogram-style">
            <h1 className="pie-title">Hypnogram</h1>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hypnoData.map(d => ({ ...d, time: format(d.time, 'HH:mm') }))}>
                        <defs>
                            <linearGradient id="colorPhase" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2a2d6f" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#005eff" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>

                        <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 12, fill: '#020413' }} 
                            ticks={xTicks}
                            padding={{left: 10}}
                        />

                        <YAxis
                            dataKey="phase"
                            domain={[0, 4]}
                            ticks={[0, 1, 2, 3]}
                            tickFormatter={(value) => SLEEP_PHASES[value]}
                            tick={{ fontSize: 12, fill: '#020413' }}
                        />
                        <Tooltip />

                        <Area
                            type="stepAfter"
                            dataKey="phase"
                            stroke="#00bfff"
                            fill="url(#colorPhase)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Hypnogram;
