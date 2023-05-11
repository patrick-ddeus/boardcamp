import { db } from "../database/connect.js";


const getAllCustomers = async (req, res) => {
    try {
        const customers = await db.query(`SELECT id, name, phone, cpf, birthday FROM customers`);
        res.status(201).json({ message: "Ok!", customers: customers.rows });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const postCustomer = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await db.query(`
        INSERT INTO 
        customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4) `,
            [name, phone, cpf, birthday]);

        res.sendStatus(201);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getOneCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const customers = await db.query(`
        SELECT id, name, phone, cpf, birthday 
        FROM customers 
        WHERE id=$1
        `, [id]);

        if (!customers.rows.length) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        res.status(201).json({ message: "Ok!", customers: customers.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateCustomer = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        await db.query(`
        UPDATE customers 
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5
        `, [name, phone, cpf, birthday, id]);

        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export default {
    getAllCustomers,
    postCustomer,
    getOneCustomer,
    updateCustomer
};