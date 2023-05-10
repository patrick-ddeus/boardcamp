import express from "express";
import cors from "cors";

const app = express();
const porta = 5000;

app.use(express.json());
app.use(cors());

app.listen(porta, () => console.log(`
    Servidor iniciado na porta ${porta}
`));