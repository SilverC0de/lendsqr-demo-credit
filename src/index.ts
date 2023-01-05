import express from "express";
import helmet from "helmet";
import { AllRoutes } from "./routes";
import { ENVIRONMENT, PORT } from "./config";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", AllRoutes);

app.all("*", (req, res) => {
    res.json({
        version: "base",
        environment: ENVIRONMENT,
        time: new Date()
    });
});

app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}!`);
});

export default app;
