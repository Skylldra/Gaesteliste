const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL-Client

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL-Verbindung über die externe oder interne Database-URL
const pool = new Pool({
    connectionString: 'postgresql://gaestelistedb_o0ev_user:SsPaukVReZVdYnkCc7Ih1VQ2LtyUFHJb@dpg-crn9tft6l47c73ac0tvg-a/gaestelistedb_o0ev', // Füge hier die interne oder externe URL ein
    ssl: {
        rejectUnauthorized: false, // Falls SSL erforderlich ist (z.B. bei Render)
    },
});

app.use(bodyParser.json());
app.use(cors()); // CORS aktivieren

// Funktion zum Erstellen der Tabelle, falls sie nicht existiert
const createTableIfNotExists = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            message TEXT
        );
    `;
    try {
        await pool.query(query);
        console.log('Tabelle "messages" wurde erstellt oder existiert bereits.');
    } catch (err) {
        console.error('Fehler beim Erstellen der Tabelle:', err);
    }
};

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

// Starte den Server und prüfe, ob die Tabelle erstellt werden muss
app.listen(PORT, async () => {
    console.log(`Server läuft auf Port ${PORT}`);
    await createTableIfNotExists(); // Tabelle beim Serverstart erstellen
});
