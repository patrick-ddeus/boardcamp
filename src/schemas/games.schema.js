import Joi from "joi";

export const gameSchema = Joi.object({
    name: Joi.string().required().trim(),
    image:Joi.string().required().trim(),
    stockTotal:Joi.number().required(),
    pricePerDay:Joi.number().required(),
})