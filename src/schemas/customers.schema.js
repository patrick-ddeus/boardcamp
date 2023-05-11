import Joi from "joi";

export const customerSchema = Joi.object({
    name: Joi.string().required().trim(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().trim(),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required().trim(),
    birthday: Joi.date().required(),
});