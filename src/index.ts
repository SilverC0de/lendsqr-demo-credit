import express from 'express';

const port : number = 2000;
const app = express();

app.get('/', (req, res) => {
    res.send('Well aiit!');
})

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})