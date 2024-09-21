const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); // Importiere das CORS-Modul
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Aktiviere CORS für alle Anfragen
app.use(cors());

// Serve a basic response for the root path
app.get('/', (req, res) => {
    res.send('<h1>Willkommen im Freundebuch!</h1><p>Die Seite funktioniert!</p>');
});

app.post('/submit-message', (req, res) => {
    const { name, message } = req.body;
    const textToSave = "${message}" von ${name}\n;

    fs.appendFile('Nachrichten.txt', textToSave, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben in die Datei:', err);
            return res.status(500).send('Fehler beim Speichern der Nachricht.');
        }
        res.send('Nachricht erfolgreich gespeichert.');
    });
});

app.listen(PORT, () => {
    console.log(Server läuft auf Port ${PORT});
});
