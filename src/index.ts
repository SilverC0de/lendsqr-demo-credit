import express from 'express';
import helmet from 'helmet';
import { AllRoutes } from './routes/index.js';
import { ENVIRONMENT, PORT } from './config/index.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', AllRoutes)

app.all('*', (req, res) => {
    res.json({
        version: 'base',
        environment: ENVIRONMENT,
        time: new Date()
    });
})

app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}!`);
})

export default app;