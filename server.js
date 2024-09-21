const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL-Verbindung
const pool = new Pool({
    connectionString: 'deine_database_url_hier', // Ersetze durch deine PostgreSQL-Datenbank-URL
    ssl: {
        rejectUnauthorized: false,
    },
});

app.use(bodyParser.json());
app.use(cors()); // CORS aktivieren

const adminPassword = 'dein_admin_passwort'; // Setze hier dein Admin-Passwort

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

// Route zum Abrufen aller Nachrichten
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

// Route zum Löschen einer bestimmten Nachricht
app.post('/admin/delete-message', async (req, res) => {
    const { id, password } = req.body;

    // Passwort prüfen
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

// Route zum Löschen aller Nachrichten
app.post('/admin/clear-messages', async (req, res) => {
    const { password } = req.body;

    // Passwort prüfen
    if (password !== adminPassword) {
        return res.status(403).send('Falsches Passwort.');
    }

    try {
        await pool.query('TRUNCATE TABLE messages');
        res.send('Alle Nachrichten erfolgreich gelöscht.');
    } catch (err) {
        console.error('Fehler beim Leeren der Tabelle:', err);
        res.status(500).send('Fehler beim Leeren der Tabelle.');
    }
});

// Starte den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
