import joi from "joi"


export const createCardSchema = joi.object({
    employeeId:joi.number().integer().required(),
    cardType:joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
})


export const activateCardSChema = joi.object({
    cardId:joi.number().integer().required(),
    CVC: joi.number().required(),
    password: joi.string().length(4).pattern(/^[0-9]+$/).required()
})

export const blockAndUnblockCardSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().required()
})