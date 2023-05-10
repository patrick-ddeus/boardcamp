import { db } from "../database/connect.js";

const getAllGames = async (req, res) => {
    try {
        const games = await db.query(`SELECT * FROM games`);

        if (!games.rows.length) {
            return res.status(404).json({ message: "Não existem jogos cadastrados!" });
        }

        res.status(201).json({ message: "Ok!", games: games.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const insertGame = async (req, res) => {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const games = await db.query(`INSERT INTO GAMES 
        (name, image, "stockTotal", "pricePerDay") 
        VALUES ('${name}', '${image}', '${stockTotal}', '${pricePerDay}')`);

        res.status(201).json({ message: "Ok!", games: games.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllGames,
    insertGame
};