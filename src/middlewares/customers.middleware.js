import { db } from "../database/connect.js";
import { customerSchema } from "../schemas/customers.schema.js";

export const validCustomer = async (req, res, next) => {
    const { name, phone, cpf, birthday } = req.body;

    const { error } = customerSchema.validate({
        name, phone, cpf, birthday
    });

    if (error) {
        const erros = error.details.map(detail => detail.message);
        return res.status(400).json({ message: "Campo body inválido!", error: erros });
    }

    try {
        const customer = await db.query(`SELECT cpf FROM customers WHERE cpf=$1`, [cpf]);

        if (customer.rows.length) {
            return res.status(409).json({ message: "Cliente já cadastrado" });
        }

        return next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const validUpdateCustomer = async (req, res, next) => {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    const { error } = customerSchema.validate({
        name, phone, cpf, birthday
    });

    if (error) {
        const erros = error.details.map(detail => detail.message);
        return res.status(400).json({ message: "Campo body inválido!", error: erros });
    }

    try {
        const { rows } = await db.query(`SELECT cpf FROM customers WHERE id=$1`, [id]);

        if (!rows.length) {
            return res.status(404).json({ message: "Usuário inexistente!" });
        }

        const customerCpf = await db.query(`SELECT cpf FROM customers WHERE cpf=$1`, [cpf]);

        if (customerCpf.rows.length && customerCpf.rows[0].cpf !== rows[0].cpf) {
            return res.status(409).json({ message: "CPF inserido é inválido para esse cliente!" });
        }

        return next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};