import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';

const WeekNavigator = ({ onSelectDay }) => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lunedì
    const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handleDayClick = (day) => {
        setSelectedDay(day);
        onSelectDay(day); // Passa il giorno alla Dashboard
    };

    return (
        <nav>
            {Array.from({ length: 7 }, (_, i) => {
                const day = format(addDays(currentWeekStart, i), 'yyyy-MM-dd');
                return (
                    <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        style={{
                            padding: '10px',
                            margin: '10px',
                            background: day === selectedDay ? '#ffbe0b' : 'rgba(255, 255, 255, 0.6)',
                            color: day === selectedDay ? '#660708' : 'black',
                            borderRadius: '15px',
                            borderStyle: 'hidden',
                            cursor: 'pointer'
                        }}>
                        {format(addDays(currentWeekStart, i), 'EEE dd')}
                    </button>
                );
            })}
        </nav>
    );
};

export default WeekNavigator;
