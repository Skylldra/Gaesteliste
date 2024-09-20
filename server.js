const express = require('express');
const bodyParser = require('body-parser');
const { Dropbox } = require('dropbox');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Verwende den Access Token aus der Umgebungsvariable
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch });

app.use(bodyParser.json());

app.post('/submit-message', (req, res) => {
    const { name, message } = req.body;
    const textToSave = `"${message}" von ${name}\n`;

    // Upload der Nachricht zu Dropbox
    dbx.filesUpload({
        path: '/Nachrichten.txt',
        contents: textToSave,
        mode: { ".tag": "append" } // Fügt den Text ans Ende der Datei an
    })
    .then(response => {
        console.log('Nachricht erfolgreich gespeichert:', response);
        res.send('Nachricht erfolgreich gespeichert.');
    })
    .catch(error => {
        console.error('Fehler beim Hochladen in Dropbox:', error);
        res.status(500).send('Fehler beim Speichern der Nachricht.');
    });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
