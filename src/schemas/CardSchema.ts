import joi from "joi"


export const createCardSchema = joi.object({
    employeeId:joi.number().integer().required(),
    cardType:joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required()
})


export const activateCardSChema = joi.object({
    cardId:joi.number().integer().required(),
    CVC: joi.number().required(),
    password: joi.string().length(4).pattern(/^[0-9]+$/).required()
})

