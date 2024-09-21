const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL-Client

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL-Verbindung
const pool = new Pool({
    connectionString: 'postgresql://gaestelistedb_o0ev_user:SsPaukVReZVdYnkCc7Ih1VQ2LtyUFHJb@dpg-crn9tft6l47c73ac0tvg-a/gaestelistedb_o0ev', // Füge deine Datenbank-URL ein
    ssl: {
        rejectUnauthorized: false, // Falls SSL erforderlich ist
    },
});

app.use(bodyParser.json());
app.use(cors()); // CORS aktivieren

const adminPassword = 'admin2002'; // Setze hier dein Admin-Passwort

// Route für das Speichern der Nachricht in der Datenbank
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

// Route zum Abrufen der Nachrichten
app.get('/get-messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages ORDER BY id ASC');
        const messages = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            message: row.message,
        }));
        res.json(messages);
    } catch (err) {
        console.error('Fehler beim Abrufen der Nachrichten:', err);
        res.status(500).send('Fehler beim Abrufen der Nachrichten.');
    }
});

// Route zum Löschen einer Nachricht
app.post('/delete-message', async (req, res) => {
    const { id, password } = req.body;

    // Überprüfen des Admin-Passworts
    if (password !== adminPassword) {
        return res.status(403).send('Falsches Passwort.');
    }

    try {
        await pool.query('DELETE FROM messages WHERE id = $1', [id]);
        res.send('Nachricht erfolgreich gelöscht.');
    } catch (err) {
        console.error('Fehler beim Löschen der Nachricht:', err);
        res.status(500).send('Fehler beim Löschen der Nachricht.');
    }
});

// Starte den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
