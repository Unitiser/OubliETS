const express = require('express')
const app = express()

const APP_DIRECTORY = '../oubliets/dist/';

app.use("/", express.static(APP_DIRECTORY));

app.listen(3000, () => console.log('OubliETS listening on port 3000!'))