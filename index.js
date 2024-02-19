const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');
const { put } = require('@vercel/blob');
const { del } = require('@vercel/blob');

const app = express();
const port = process.env.PORT || 3000;

const API_KEY = 'patNGGF2SE0aMPe0q.9ffb4220c5a673c8784a715d274181447bd7c9689dc3297e7d842b956972ae8c';
const BASE_ID = 'appFMt6Nbno4JDTUp';
const TABLE_NAME = 'tblxtDFabGTfjdaMp';

const airtableClient = new Airtable({ apiKey: API_KEY }).base(BASE_ID).table(TABLE_NAME);

app.use(express.json()); // Middleware per parsare il corpo delle richieste JSON

app.post('/files', async (req, res) => {
    const { id, recordId, accounts, date_from, date_to } = req.body; // Estrai i parametri della query correttamente

    try {
        // Prepara i dati per la richiesta POST
        const postData = {
            id: id,
            accounts: accounts,
            dateFrom: date_from,
            dateTo: date_to,
        };

        // Per gestire i buffer direttamente, assicurati che la risposta sia in formato 'arraybuffer'
        const pdfResponse = await axios.post('https://sincrobank-python.up.railway.app/pdf', postData, { responseType: 'arraybuffer' });
        const excelResponse = await axios.post('https://sincrobank-python.up.railway.app/excel', postData, { responseType: 'arraybuffer' });

        console.log(pdfResponse.data, excelResponse.data)

        // Supponendo che `put` sia una funzione asincrona che accetta (id, buffer, options)
        const pdfBuffer = Buffer.from(pdfResponse.data, 'binary');
        const excelBuffer = Buffer.from(excelResponse.data, 'binary');

        // Assicurati che l'ID sia unico per ogni file e che `put` sia definita per gestire il caricamento
        const pdfUrl = await put(id, pdfBuffer, { contentType: 'application/pdf', access: 'public', token: 'vercel_blob_rw_RYm0UU5sv1ARmTqu_ILwJWC1HonAq006aMDM7VCsxTGGy9K' });
        const excelUrl = await put(id, excelBuffer, { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', access: 'public', token: 'vercel_blob_rw_RYm0UU5sv1ARmTqu_ILwJWC1HonAq006aMDM7VCsxTGGy9K' });

        console.log(pdfUrl.url, excelUrl.url);

        const record = await airtableClient.find(recordId);
        const currentPdfFiles = record.fields['pdf'] ? record.fields['pdf'] : [];
        const currentExcelFiles = record.fields['excel'] ? record.fields['excel'] : [];

        // Update the record with the new file added to the existing 'pdf' files
        const response = await airtableClient.update(recordId, {
            'pdf': [...currentPdfFiles, {url: pdfUrl.url, filename: `${id}.pdf`}],
            // Assuming you want to replace the 'excel' field with a new file
            'excel': [...currentExcelFiles, {url: excelUrl.url, filename: `${id}.xlsx`}]
        });

        setTimeout(async () => {
            await del(pdfUrl.url, { token: 'vercel_blob_rw_RYm0UU5sv1ARmTqu_ILwJWC1HonAq006aMDM7VCsxTGGy9K' });
            await del(excelUrl.url, { token: 'vercel_blob_rw_RYm0UU5sv1ARmTqu_ILwJWC1HonAq006aMDM7VCsxTGGy9K' });
        }, 10000); // Delete the files after 10 seconds

        console.log('File caricati con successo!', response);
        // Invia la risposta al client
        res.status(200).send({ message: 'File caricato con successo!', data: response });
    } catch (error) {
        console.error('Si è verificato un errore:', error);
        res.status(500).send('Errore durante il caricamento del file');
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hello, World!</h1>');
});


app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});