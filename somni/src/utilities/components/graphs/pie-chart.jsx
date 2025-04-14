import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormatData from './format-data';
import { format, parseISO } from 'date-fns';
import '../../../pages/dashboad/dashboard.css';

const COLORS = ['#00f5d4', '#003566', '#ffbe0b', '#ff006e']; // Colori per le fasi del sonno

const pieChart = ({ data, targetDay }) => {
    if (!data) {
        alert('Missing data');
        return <h1>No data is available</h1>;
    }

    if (!targetDay) {
        alert('Missing target day');
    }

    const ByDateData = data.filter(({ timestamp }) => {
        const dateOnly = format(parseISO(timestamp), 'yyyy-MM-dd'); // Estrai solo la data
        return dateOnly === targetDay;
    });

    const pieData = FormatData(ByDateData);

    const formatLabel = (value) => {
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}min`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}min`;
        }
    };

    //verifica i valori contenuti nei dati. Se tutti a 0 ==> nessun dato per quella data
    let res = 0;
    pieData.forEach((entry) => {
        res += entry.value;
    });

    return res != 0 ? (
        <div className="pie-chart-style">
            <h1 className="pie-title">Sleep Stages</h1>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius="70%"
                            fill="#8884d8"
                            dataKey="value"
                            label={({ value }) => formatLabel(value)}>
                            {pieData.map((pieData, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    ) : null;
};

export default pieChart;
