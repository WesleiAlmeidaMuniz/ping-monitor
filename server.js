const express = require('express');
const ping = require('ping');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/ping', async (req, res) => {
    const hosts = (req.query.hosts || 'error').split(','); // Hosts separados por vírgula
    const results = [];

    for (const host of hosts) {
        try {
            const response = await ping.promise.probe(host);
            results.push({ host, time: response.alive ? response.time : 'Inativo' });
        } catch (error) {
            results.push({ host, error: 'Erro ao pingar' });
        }
    }
    res.json(results);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
