const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); // Aktiviere CORS

// Serve a basic response for the root path
app.get('/', (req, res) => {
    res.send('<h1>Willkommen im Freundebuch!</h1><p>Die Seite funktioniert!</p>');
});

// Route für das Speichern der Nachricht in der Textdatei
app.post('/submit-message', (req, res) => {
    const { name, message } = req.body;
    const textToSave = `"${message}" von ${name}\n`;

    fs.appendFile('Nachrichten.txt', textToSave, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben in die Datei:', err);
            return res.status(500).send('Fehler beim Speichern der Nachricht.');
        }
        res.send('Nachricht erfolgreich gespeichert.');
    });
});

// Route zum Abrufen der Nachrichten aus der Datei
app.get('/get-messages', (req, res) => {
    const filePath = path.join(__dirname, 'Nachrichten.txt'); // Pfad zur Datei
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
