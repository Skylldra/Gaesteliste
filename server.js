const { Pool } = require('pg');

// Erstelle eine Verbindung zur PostgreSQL-Datenbank
const pool = new Pool({
    user: 'YOUR_DB_USER',
    host: 'YOUR_DB_HOST',
    database: 'YOUR_DB_NAME',
    password: 'YOUR_DB_PASSWORD',
    port: 'YOUR_DB_PORT',
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
