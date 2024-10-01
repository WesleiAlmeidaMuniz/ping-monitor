const express = require('express');
const ping = require('ping');
const path = require('path');
const { exec } = require('child_process'); // Substitui o pacote 'open'
const os = require('os');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/ping', async (req, res) => {
    const hosts = (req.query.hosts || 'error').split(','); // Hosts separados por vírgula
    const pingPromises = hosts.map(async host => {
        try {
            const response = await ping.promise.probe(host);
            return { host, time: response.alive ? response.time : 'Inativo' };
        } catch (error) {
            return { host, error: 'Erro ao pingar' };
        }
    });

    const results = await Promise.all(pingPromises); // Executa os pings em paralelo
    res.json(results);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

    // Apenas abre o navegador no Windows
    if (os.platform() === 'win32') {
        exec(`start http://localhost:${PORT}`);
    }
});


