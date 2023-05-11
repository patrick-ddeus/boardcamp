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
        const customer = db.query(`SELECT cpf FROM customers WHERE cpf='$1'`, [cpf]);

        if (customer.rows.length) {
            return res.status(409).json({ message: "Cliente com esse CPF já cadastrado!" });
        }

    } catch (error) {
        res.status(500).json({ error: error });
    }

};