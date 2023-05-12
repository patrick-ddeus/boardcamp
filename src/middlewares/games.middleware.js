import { db } from "../database/connect.js";
import { gameSchema } from "../schemas/games.schema.js";

export const validGame = async (req, res, next) => {
    const { name, image, stockTotal, pricePerDay } = req.body;

    const { error } = gameSchema.validate({
        name, image, stockTotal, pricePerDay
    });

    if (error) {
        const erros = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Campo body inválido!", error: erros });
    }

    if (Number(stockTotal) <= 0 || Number(pricePerDay) <= 0) {
        return res.sendStatus(400);
    }

    try {
        const data = await db.query(`SELECT * FROM games WHERE name='${name}'`);

        if (data.rows.length) {
            return res.status(409).json({ message: "Jogo já cadastrado, insira outro nome!" });
        }

        
    } catch (error) {
        res.status(500).json({ error: error });
    }
};