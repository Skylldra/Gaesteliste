const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL-Verbindung
const pool = new Pool({
    connectionString: 'postgresql://gaestelistedb_o0ev_user:SsPaukVReZVdYnkCc7Ih1VQ2LtyUFHJb@dpg-crn9tft6l47c73ac0tvg-a/gaestelistedb_o0ev', // Ersetze durch deine PostgreSQL-Datenbank-URL
    ssl: {
        rejectUnauthorized: false,
    },
});

app.use(bodyParser.json());
app.use(cors()); // CORS aktivieren

// Setze Multer für das Hochladen von Bildern
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ordner, in dem die Bilder gespeichert werden
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Dateiname mit Zeitstempel und Original-Erweiterung
    }
});

const upload = multer({ storage: storage });

const adminPassword = 'adminpassw0rd'; // Setze hier dein Admin-Passwort

// Route zum Speichern der Nachricht
app.post('/submit-message', async (req, res) => {
    const { name, message } = req.body;

    try {
        const query = 'INSERT INTO messages (name, message) VALUES ($1, $2)';
        await pool.query(query, [name, message]);
        res.send('Nachricht erfolgreich gespeichert.');
    } catch (err) {
        console.error('Fehler beim Speichern der Nachricht:', err);
        res.status(500).send('Fehler beim Speichern der Nachricht.');
    }
});

// Route zum Hochladen eines Fotos
app.post('/upload-photo', upload.single('photo'), (req, res) => {
    try {
        res.send(`Foto erfolgreich hochgeladen: ${req.file.filename}`);
    } catch (err) {
        console.error('Fehler beim Hochladen des Fotos:', err);
        res.status(500).send('Fehler beim Hochladen des Fotos.');
    }
});

// Route zum Abrufen aller Fotos
app.get('/get-photos', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Fehler beim Abrufen der Fotos.');
        }
        
        const photoUrls = files.map(file => `/uploads/${file}`);
        res.json(photoUrls);
    });
});

// Statische Dateien aus dem 'uploads'-Ordner bereitstellen
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Starte den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
