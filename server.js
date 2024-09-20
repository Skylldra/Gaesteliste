const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Pfad zur Nachrichten.txt-Datei
const filePath = path.join(__dirname, 'Nachrichten.txt');

// Route für das Speichern der Nachricht in der Textdatei
app.post('/submit-message', (req, res) => {
    console.log('POST /submit-message aufgerufen');
    
    const { name, message } = req.body;

    // Protokolliere die empfangenen Daten
    console.log('Empfangene Daten:', { name, message });

    // Überprüfe, ob die Daten korrekt übermittelt wurden
    if (!name || !message) {
        console.error('Fehler: Name oder Nachricht fehlen.');
        return res.status(400).send('Fehler: Name oder Nachricht fehlen.');
    }

    const textToSave = `"${message}" von ${name}\n`;

    // Füge die Nachricht zur Datei hinzu
    fs.appendFile(filePath, textToSave, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben in die Datei:', err);
            return res.status(500).send('Fehler beim Speichern der Nachricht.');
        }
        console.log('Nachricht erfolgreich gespeichert.');
        res.send('Nachricht erfolgreich gespeichert.');
    });
});

// Route zum Abrufen der Nachrichten
app.get('/get-messages', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Lesen der Datei:', err);
            return res.status(500).send('Fehler beim Abrufen der Nachrichten.');
        }
        res.send(`<pre>${data}</pre>`); // Nachrichten im Browser anzeigen
    });
});

// Starte den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
