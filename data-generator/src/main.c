#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define PROB 0.7

char *next_stage(char*);

void itoa(int, char*);

// Possibili fasi del sonno
char *stage[] = {"Light", "Deep", "REM", "Awake"};

//giorni della settimana
char *week[] = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};

//giorni nei vari mesi
int days_per_mont[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

int main(void) {
    srand(time(NULL));  // Seed per numeri pseudo-casuali

    int c;
    char year[5], month[3], day[3], date[50];
    printf("Provide a date in the format 'yyyy-MM-dd'\n");
    printf("Please enter the current year: ");
    fgets(year, sizeof(year), stdin);
    while ((c = getchar()) != '\n' && c != EOF);
    printf("Please enter the month you are referring to: ");
    fgets(month, sizeof(month), stdin);
    while ((c = getchar()) != '\n' && c != EOF);
    printf("Please enter the first day of the week you are considering: ");
    fgets(day, sizeof(day), stdin);
    while ((c = getchar()) != '\n' && c != EOF);

    for (int day_of_the_week = 0; day_of_the_week < 7; day_of_the_week++) {
        //Genera la data
        int slider;
        int year_slider = 0;
        int month_slider = 0;
        int day_slider = 0;
        for (slider = 0; slider < 10; slider++) {
            if (slider == 4 || slider == 7) {
                date[slider] = '-';
            } else if (slider >= 0 && slider <= 3) {
                date[slider] = year[year_slider];
                year_slider++;
            } else if (slider >= 5 && slider <= 6) {
                date[slider] = month[month_slider];
                month_slider++;
            } else if (slider >= 8 && slider <= 9) {
                date[slider] = day[day_slider];
                day_slider++;
            }
        }
        date[slider] = ' ';
        date[slider + 1] = '\0'; //aggiungiamo il carattere di fine stringa

        int h, min;
        printf("\n%s\n", week[day_of_the_week]);
        printf("How many hours do you want to sleep? ");
        scanf("%d", &h);
        printf("How many minutes do you want to sleep? ");
        scanf("%d", &min);


        //definizione nome del file
        char filename[100] = "../../data/sleep-data-";
        strcat(filename, week[day_of_the_week]);
        strcat(filename, "-");
        strcat(filename, day);  //aggiunge il giorno del mese
        strcat(filename, ".csv");   //aggiunge l'estensione
        //apertura del file
        FILE *fd = fopen(filename, "a");
        if (fd == NULL) {
            printf("Unable to open file %s\n", filename);
            return 1;
        }
        fprintf(fd, "Timestamp,Sleep Stage\n");

        // Numero totale di intervalli da generare
        int total_interval = h * 60 + min;

        int starting_sleep_h, starting_sleep_min = 0;
        printf("\nWhen do you go to sleep?\n");
        printf("Hour: ");
        scanf("%d", &starting_sleep_h);
        printf("Minutes: ");
        scanf("%d", &starting_sleep_min);


        //definisce l'istante temporale della timestamp
        char time[10];

        // Inizio sempre con Light
        char *current_stage = "Light";

        for (int i = 0; i < total_interval; i++) {
            // DEFINIZIONE DELLA TIMESTAMP
            //inizializza ora, minuti e secondi
            char h[3];
            itoa(starting_sleep_h, h);
            int h_next = 0;
            char m[3];
            itoa(starting_sleep_min, m);
            int m_next = 0;
            char s[3];
            itoa(0, s);
            int s_next = 0;

            //genera il tempo
            for (int j = 0; j < 9; j++) {
                if (j == 2 || j == 5) {
                    time[j] = ':';
                } else if (j == 8) {
                    time[j] = ',';
                } else if (j >= 0 && j<= 1) {
                    time[j] = h[h_next];
                    h_next++;
                } else if (j >= 3 && j <= 4) {
                    time[j] = m[m_next];
                    m_next++;
                } else if (j >= 6 && j <= 7) {
                    time[j] = s[s_next];
                    s_next++;
                }
            }
            time[9] = '\0';

            starting_sleep_min++;
            if (starting_sleep_min == 60) {
                starting_sleep_min = 0;
                starting_sleep_h++;
            }

            if (starting_sleep_h == 24) {
                starting_sleep_h = 0;
            }

            char timestamp[50];
            strcpy(timestamp, date);

            strcat(timestamp, time);

            // DEFINISCE LA ENTRY COMPLETA
            char entry[50];
            strcpy(entry, timestamp);

            strcat(entry, current_stage);
            fprintf(fd, "%s\n", entry);

            //genera lo stato successivo
            current_stage = next_stage(current_stage);
        }
        printf("Data generated for %s\n", week[day_of_the_week]);

        //imposta il giorno sul successivo
        int new_day = atoi(day);
        int actual_month = atoi(month);
        new_day++;
        if (new_day > days_per_mont[actual_month - 1]) {
            new_day = 1;
            actual_month++;
        }
        itoa(new_day, day);
        itoa(actual_month, month);
    }


    return 0;
}

// Genera la prossima fase rispettando le transizioni del sonno
char *next_stage(char *current_phase) {
    double r = (double)rand() / RAND_MAX;  // Numero casuale tra 0 e 1

    if (strcmp(current_phase, "Light") == 0) {
        if (r < 0.6) return "Light";  // Rimane Light nel 60% dei casi
        else if (r < 0.8) return "Deep";  // Passa a Deep nel 20% dei casi
        else return "REM";  // Passa a REM nel 20% dei casi
    }
    else if (strcmp(current_phase, "Deep") == 0) {
        return "Light";  // Dopo Deep si torna sempre a Light
    }
    else if (strcmp(current_phase, "REM") == 0) {
        if (r < 0.75) return "Light";  // 75% torna a Light
        else return "Awake";  // 25% si sveglia
    }
    else if (strcmp(current_phase, "Awake") == 0) {
        return "Light";  // Dopo Awake si torna sempre a Light
    }

    return "Light";  // Default (non dovrebbe mai accadere)
}

void itoa(int num, char *str) {
    // Estrai la decina e l'unità
    int tens = num / 10;
    int ones = num % 10;

    // Converte le cifre in caratteri e le inserisce nella stringa
    str[0] = '0' + tens;  // Converte la decina in carattere
    str[1] = '0' + ones;  // Converte l'unità in carattere
    str[2] = '\0';        // Termina la stringa con il carattere null
}
