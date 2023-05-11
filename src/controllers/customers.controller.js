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
    try {
        const customers = await db.query(`SELECT id, name, phone, cpf, birthday FROM customers`);
        res.status(201).json({ message: "Ok!", customers: customers.rows });
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
        WHERE id='$1'
        `, [id]);

        if (!customers.rows.length) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        res.status(201).json({ message: "Ok!", customers: customers.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export default {
    getAllCustomers,
    postCustomer,
    getOneCustomer
};