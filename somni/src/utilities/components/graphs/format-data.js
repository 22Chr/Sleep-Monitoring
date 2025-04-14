function FormatData(data) {
    // Funzione di formattazione per i dati per il grafico
    let lightSleep = 0;
    let deepSleep = 0;
    let remSleep = 0;
    let awakeTime = 0;

    const format = data;

    // Somma i tempi delle fasi del sonno
    format.forEach((entry) => {
        const { sleepStage, duration } = entry;

        if (duration) {
            switch (sleepStage) {
                case 'Light':
                    lightSleep += duration;
                    break;
                case 'Deep':
                    deepSleep += duration;
                    break;
                case 'REM':
                    remSleep += duration;
                    break;
                case 'Awake':
                    awakeTime += duration;
                    break;
                default:
                    break;
            }
        }
    });

    const formattedData = [
        { name: 'Light', value: lightSleep },
        { name: 'Deep', value: deepSleep },
        { name: 'REM', value: remSleep },
        { name: 'Awake', value: awakeTime },
    ];

    return formattedData;
}

export default FormatData;