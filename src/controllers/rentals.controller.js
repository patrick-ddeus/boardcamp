import { db } from "../database/connect.js";
import dayjs from "dayjs";

const getAllRentals = async (req, res) => {
    try {
        const rentals = await db.query(`
        SELECT rentals.*, customers.name as customer, games.name as game
        FROM rentals
        JOIN customers ON customers.id=rentals."customerId"
        JOIN games ON games.id=rentals."gameId"`);

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

        await db.query(`INSERT 
        INTO rentals 
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                rental.customerId,
                rental.gameId,
                rental.rentDate,
                rental.daysRented,
                rental.returnDate,
                rental.originalPrice,
                rental.delayFee
            ]);

        res.status(201).json({ message: "Ok!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const finishRental = async (req, res) => {

};

export default {
    getAllRentals,
    postRental,
    finishRental
};