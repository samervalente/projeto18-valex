import { faker } from '@faker-js/faker';
import  dayjs from 'dayjs'
import Cryptr from "cryptr"
import dotenv from "dotenv"
import * as cardRepository from "../repositories/cardRepository"
import * as serviceUtils from "../utils/serviceUtils"
import * as employeeService from "../services/employeeService"
import formatEmployeeName from "../utils/employeeUtils";


dotenv.config()

export async function findCardByTypeAndEmployeeId(cardType:cardRepository.TransactionTypes, employeeId:number){
    const card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId)
   
    if(card){
        throw {type: "Conflict", message:"The employee already have a card of this type"}
    }
}

export async function createCard(cardType: cardRepository.TransactionTypes, employeeId: number){
    const cryptr = new Cryptr(process.env.SECRET_KEY)
     //Create card data
     const number = faker.finance.creditCardNumber()
     const securityCode = cryptr.encrypt(faker.finance.creditCardCVV())
 
     const date = (`${dayjs().year() + 5 }-${dayjs().month() + 1}`)
     const expirationDate = dayjs(date).format("MM/YY")
 
     const {fullName} = await employeeService.getEmployeeById(employeeId)
     const cardholderName = formatEmployeeName(fullName)
     
     const Card = {
       employeeId,
       number,
       cardholderName,
       securityCode,
       expirationDate,
       password: null,
       isVirtual: false,
       originalCardId: null,
       isBlocked: true,
       type: cardType
     }

     await cardRepository.insert(Card)
}

export async function activateCard(cardId: number, cvc:number, columns: object){
    
    const card = await serviceUtils.getCardById(cardId)
    await serviceUtils.validateCardExpiration(card)
   
    if(card.password !== null){
        throw {type: "Conflict", message: "This card is already actived"}
    }

    const cryptr = new Cryptr(process.env.SECRET_KEY)

    const cvcDecrypted = Number(cryptr.decrypt(card.securityCode))
    console.log(cvcDecrypted)
  
    if(cvcDecrypted !== cvc){
        throw {type: "BadRequest", message: "Invalid card CVV"}
    }

    await cardRepository.update(cardId, columns)
    
}


export async function getTransactionsAndRecharges(cardId: number){
    await serviceUtils.getCardById(cardId)
    const cardMovements = await serviceUtils.getCardMovements(cardId)

    return cardMovements
    
}

export async function lockCard(cardId: number, password: string ){
    const card = await serviceUtils.getCardById(cardId)
    await serviceUtils.validateCardExpiration(card)
 
    if(card.isBlocked){
        throw {type: "Conflict", message: "This card is already locked"}
    }
   
    await serviceUtils.validateCardPassword(card, password)

    const updateColumn = {isBlocked: true}

    await cardRepository.update(cardId, updateColumn)
}

export async function unlockCard(cardId: number, password: string ){
    const card = await serviceUtils.getCardById(cardId)
    await serviceUtils.validateCardExpiration(card)

    if(card.isBlocked === false){
        throw {type: "Conflict", message: "This card is not locked"}
    }

    await serviceUtils.validateCardPassword(card, password)

    const updateColumn = {isBlocked: false}

    await cardRepository.update(cardId, updateColumn)
}







   