import { db } from "../database/connect.js";

const getAllGames = async (req, res) => {
    const { name, offset = 0, limit = null, order, desc } = req.query;

    let whereClause = 'WHERE TRUE ';
    let orderByClause = '';

    if (name) {
        whereClause += `AND name ILIKE '${name}%'`;
    }

    if (order) {
        orderByClause += `ORDER BY "${order}" ${desc ? 'DESC' : ''}`;
    }

    try {
        const games = await db.query(`
            SELECT id, name, image, "stockTotal", "pricePerDay" 
            FROM games 
            ${whereClause}
            ${orderByClause}
            OFFSET ${offset} LIMIT ${limit}
        `);

        res.status(201).json(games.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const insertGame = async (req, res) => {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const games = await db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
            VALUES ($1, $2, $3, $4)
        `, [name, image, stockTotal, pricePerDay]);

        res.status(201).json({ message: "Ok!", games: games.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllGames,
    insertGame
};