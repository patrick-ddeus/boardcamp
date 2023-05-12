import { db } from "../database/connect.js";
import dayjs from "dayjs";

const getAllRentals = async (req, res) => {
    const {
        customerId: queryCustomerId,
        gameId: queryGameId,
        offset = 0,
        limit = null,
        order,
        desc
    } = req.query;

    let whereClause = 'WHERE TRUE';
    let orderByClause = '';

    if (queryCustomerId) {
        whereClause += `AND rentals."customerId"=${queryCustomerId}`;
    }

    if (queryGameId) {
        whereClause = `AND rentals."gameId"=${queryGameId}`;
    }

    if (order) {
        orderByClause += `ORDER BY "${order}" ${desc ? 'DESC' : ''}`;
    }

    try {
        const rentals = await db.query(`
            SELECT rentals.*, customers.name AS customer, games.name AS game
            FROM rentals
            JOIN customers ON customers.id=rentals."customerId"
            JOIN games ON games.id=rentals."gameId"
            ${whereClause}
            ${orderByClause}
            OFFSET ${offset} LIMIT ${limit}
        `);

        const rentalsToSend = rentals.rows.map(rental => {
            return {
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: dayjs(rental.rentDate).format('YYYY-MM-DD'),
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
                originalPrice: rental.originalPrice,
                delayFee: rental.originalPrice,
                customer: {
                    id: rental.customerId,
                    name: rental.customer
                },
                game: {
                    id: rental.gameId,
                    name: rental.game
                }
            };
        });

        res.status(200).json({ message: "Ok", rentals: rentalsToSend });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const postRental = async (req, res) => {
    const { customerId, gameId, daysRented, pricePerDay } = req.rental;
    const originalPrice = pricePerDay * daysRented;

    try {
        const rental = {
            customerId,
            gameId,
            rentDate: dayjs().format('DD-MM-YYYY'),
            daysRented,
            returnDate: null,
            originalPrice,
            delayFee: null
        };

        await db.query(`
            INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, Object.values(rental));

        res.status(201).json({ message: "Ok!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const finishRental = async (req, res) => {
    const { id } = req.params;
    const { rental } = req.rental;

    const currentDate = new Date();
    const rentDate = new Date(rental.rentDate);
    const daysToExpire = rentDate.getTime() + rental.daysRented * (1000 * 60 * 60 * 24);
    let delayFee = 0;

    if (currentDate > daysToExpire) {
        const delayDays = Math.floor((currentDate - daysToExpire) / (1000 * 60 * 60 * 24));
        delayFee = delayDays * (rental.originalPrice / rental.daysRented);
    }

    try {
        const returnDate = dayjs(Date.now()).format('YYYY-MM-DD');

        await db.query(`
            UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3
        `, [returnDate, delayFee, id]);

        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteRental = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(`DELETE FROM rentals WHERE id=$1 `, [id]);
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export default {
    getAllRentals,
    postRental,
    finishRental,
    deleteRental
};