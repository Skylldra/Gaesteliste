const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL-Client

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL-Verbindung - füge hier deine Datenbankverbindungsdetails direkt ein
const pool = new Pool({
    user: 'gaestelistedb_o0ev_user',      // PostgreSQL-Benutzername
    host: 'dpg-crn9tft6l47c73ac0tvg-a',              // PostgreSQL-Host (z.B. "localhost" oder bei Render der spezifische Hostname)
    database: 'gaestelistedb_o0ev',    // Name der Datenbank
    password: 'SsPaukVReZVdYnkCc7Ih1VQ2LtyUFHJb',      // PostgreSQL-Passwort
    port: 5432,                     // Port der PostgreSQL-Datenbank, in der Regel 5432
    ssl: {
        rejectUnauthorized: false,  // Bei Cloud-Umgebungen wie Render oder Heroku notwendig
    },
});

app.use(bodyParser.json());
app.use(cors()); // Aktiviere CORS

// Serve a basic response for the root path
app.get('/', (req, res) => {
    res.send('<h1>Willkommen im Freundebuch!</h1><p>Die Seite funktioniert!</p>');
});

// Route für das Speichern der Nachricht in der Datenbank
app.post('/submit-message', async (req, res) => {
    const { name, message } = req.body;

    try {
        const query = 'INSERT INTO messages (name, message) VALUES ($1, $2)';
        await pool.query(query, [name, message]);
        console.log(`Nachricht gespeichert: "${message}" von ${name}`);
        res.send('Nachricht erfolgreich gespeichert.');
    } catch (err) {
        console.error('Fehler beim Speichern der Nachricht:', err);
        res.status(500).send('Fehler beim Speichern der Nachricht.');
    }
});

// Route zum Abrufen der Nachrichten aus der Datenbank
app.get('/get-messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages ORDER BY id ASC');
        const messages = result.rows.map(row => `"${row.message}" von ${row.name}`).join('\n');
        res.send(`<pre>${messages}</pre>`);
    } catch (err) {
        console.error('Fehler beim Abrufen der Nachrichten:', err);
        res.status(500).send('Fehler beim Abrufen der Nachrichten.');
    }
});

// Starte den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
