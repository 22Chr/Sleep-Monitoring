import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../../pages/trends/trends.css';

const SleepBarChart = ({ data }) => {
    if (!data) {
        alert('Missing data');
        return <h1 className='info'>No data is available</h1>;
    }

    const wbarData = data;

    let res = 0;
    wbarData.forEach((entry) => {
        res += entry.count;
    });

    return res > 0 ? (
        <div className='wBar-style'>
            <div style={{ width: '100%', height: 400, border: '0.001px solid rgba(255, 255, 255, 0.001' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wbarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} animationDuration={1200}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{ fill: 'white' }} />
                        <YAxis
                            allowDecimals={false}
                            tickFormatter={(value) => `${(value / 60).toFixed(1)}h`}
                            tick={{ fill: '#c2c9f9' }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.3)' }}
                        />
                        <Bar dataKey="count" fill="#90e0ef" barSize={35}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    ) : (
        <h1 className='info'>Waiting for data...</h1>
    );
};

export default SleepBarChart;
