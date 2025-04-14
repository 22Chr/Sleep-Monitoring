# Nome dell'eseguibile (modificalo come vuoi)
TARGET = bin/data-generator

# Imposta compilatore e flag
CC = gcc
CFLAGS = -Wall -Wextra -Iinclude

# Trova tutti i file .c in src/
SRC_DIR = src
OBJ_DIR = obj
BIN_DIR = bin

# Crea la lista dei file sorgente e file oggetto corrispondenti
SOURCES = $(wildcard $(SRC_DIR)/*.c)
OBJECTS = $(patsubst $(SRC_DIR)/%.c, $(OBJ_DIR)/%.o, $(SOURCES))

# Regola principale: crea l'eseguibile
$(TARGET): $(OBJECTS) | $(BIN_DIR)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJECTS)

# Regola per compilare i file .c in file .o
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# Crea le cartelle obj/ e bin/ se non esistono
$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

$(BIN_DIR):
	mkdir -p $(BIN_DIR)

# Comando per pulire i file compilati
clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)

# Regola per mostrare i file sorgente e oggetto trovati (utile per debug)
show:
	@echo "Sorgenti: $(SOURCES)"
	@echo "Oggetti: $(OBJECTS)"