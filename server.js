const { Pool } = require('pg');

// Erstelle eine Verbindung zur PostgreSQL-Datenbank
const pool = new Pool({
    user: 'gaestelistedb_user',
    host: 'dpg-crmvhgl6l47c73a7mocg-a',
    database: 'gaestelistedb',
    password: 'sC1p2PyAAJQbzys1QKV6Z0hCQ8TsSCmE',
    port: '5432',
});

// Route für das Speichern der Nachricht in der Datenbank
app.post('/submit-message', async (req, res) => {
    const { name, message } = req.body;
    try {
        await pool.query('INSERT INTO messages (name, message) VALUES ($1, $2)', [name, message]);
        res.send('Nachricht erfolgreich gespeichert.');
    } catch (error) {
        console.error('Fehler beim Speichern der Nachricht:', error);
        res.status(500).send('Fehler beim Speichern der Nachricht.');
    }
});
