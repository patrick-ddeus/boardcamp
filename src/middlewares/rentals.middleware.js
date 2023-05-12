import { db } from "../database/connect.js";
import rentalSchema from "../schemas/rentals.schema.js";

export const validRental = async (req, res, next) => {
    const { customerId, gameId, daysRented } = req.body;

    const { error } = rentalSchema.validate({
        customerId, gameId, daysRented
    });

    if (error) {
        const erros = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Campo body inválido!", error: erros });
    }

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);

        if (!customer.rows.length) {
            return res.status(400).json({ message: "Usuário Inexistente!" });
        }

        const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);

        if (!game.rows.length) {
            return res.status(400).json({ message: "Jogo Inexistente!" });
        }

        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId]);

        if (rentals.rows.length >= game.rows[0].stockTotal) {
            return res.status(400).json({ message: "Este jogo não está mais disponível!" });
        }

        req.rental = {
            customerId,
            gameId,
            daysRented,
            pricePerDay: game.rows[0].pricePerDay,
        };

        return next();

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const validFinishRental = async (req, res, next) => {
    const { id } = req.params;
    try {
        const rentals = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);

        if (!rentals.rows.length) {
            return res.status(404).json({ message: "Aluguel inexistente!" });
        }

        if (req.method === "POST" && rentals.rows[0].returnDate) {
            return res.status(400).json({ message: "Aluguel já finalizado!" });
          }
      
          if (req.method === "DELETE" && !rentals.rows[0].returnDate) {
            return res.status(400).json({ message: "Aluguel não finalizado" });
          }

        req.rental = { rental: rentals.rows[0] };
        return next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

