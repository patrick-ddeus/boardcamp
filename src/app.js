import express from "express";
import cors from "cors";
import GamesRouter from "./routes/games.routes.js";
import CustomersRouter from "./routes/customers.routes.js";
import RentalsRouter from "./routes/rentals.routes.js";
import "dotenv/config";

const app = express();
const porta = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/games', GamesRouter);
app.use('/customers', CustomersRouter);
app.use('/rentals', RentalsRouter);

app.listen(porta, () => console.log(`
    Servidor iniciado na porta ${porta}
`));