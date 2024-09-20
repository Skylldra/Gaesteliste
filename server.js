const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS, um Zugriff vom Client zu ermöglichen
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Post-Route zum Empfang der Nachricht
app.post('/submit-message', (req, res) => {
    const { name, message } = req.body;

    const textToSave = `"${message}" von ${name}\n`;

    // Prüfe, ob die Datei existiert, wenn nicht, wird sie erstellt
    fs.appendFile('Nachrichten.txt', textToSave, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben in die Datei:', err);
            return res.status(500).send('Fehler beim Speichern der Nachricht.');
        }
        res.send('Nachricht erfolgreich gespeichert.');
    });
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
