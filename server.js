const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); // Importiere das CORS-Modul
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
    const textToSave = `"${message}" von ${name} um ${timestamp}\n`;

    fs.appendFile('Nachrichten.txt', textToSave, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben in die Datei:', err);
            return res.status(500).send('Fehler beim Speichern der Nachricht.');
        }
        console.log(`Nachricht gespeichert: ${textToSave}`); // Protokolliere die Nachricht
        res.send('Nachricht erfolgreich gespeichert.');
    });
});

// Route zum Abrufen der Nachrichten aus der Datei
app.get('/get-messages', (req, res) => {
    const filePath = path.join(__dirname, 'Nachrichten.txt'); // Pfad zur Datei
    console.log(`Dateipfad: ${filePath}`); // Protokolliere den Pfad zur Datei

    // Prüfen, ob die Datei existiert
    if (!fs.existsSync(filePath)) {
        console.log('Datei "Nachrichten.txt" existiert nicht.');
        return res.send('<pre>Noch keine Nachrichten vorhanden.</pre>');
    }

    // Datei lesen und Nachrichten zurücksenden
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Lesen der Datei:', err);
            return res.status(500).send('Fehler beim Abrufen der Nachrichten.');
        }
        console.log(`Nachrichten erfolgreich gelesen:\n${data}`); // Protokolliere die gelesenen Nachrichten
        res.send(`<pre>${data}</pre>`);
    });
});

// Starte den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
