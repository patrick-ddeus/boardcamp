import express from "express";
import cors from "cors";
import GamesRouter from "./routes/games.routes.js";

const app = express();
const porta = 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/games', GamesRouter)

app.listen(porta, () => console.log(`
    Servidor iniciado na porta ${porta}
`));