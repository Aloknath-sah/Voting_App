const express = require('express');
const app = express();

const db = require('./db')

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log(`server is up and running at port ${PORT}`);
})