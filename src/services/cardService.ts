import * as cardRepository from "../repositories/cardRepository"
import * as paymentRepository from "../repositories/paymentRepository"
import * as rechargeRepository from "../repositories/rechargeRepository"
import Cryptr from "cryptr"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config()

export async function findCardByTypeAndEmployeeId(cardType:cardRepository.TransactionTypes, employeeId:number){
    const card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId)
   
    if(card){
        throw {type: "Conflict", message:"The employee already have a card of this type"}
    }
}

export async function activateCard(cardId: number, cvc:number, columns: object){
 
    const card = await getCardById(cardId)
    await validateCardExpiration(card)
   
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
    await getCardById(cardId)
    const transactions = await paymentRepository.findByCardId(cardId)
    const recharges: any = await rechargeRepository.findByCardId(cardId)
 
    const totalTransactions = transactions.reduce((prev: any, curr: any) => prev + curr.amount, 0)
    const totalRecharges = recharges.reduce((prev: any, curr: any) => prev + curr.amount, 0)
    const balance = totalRecharges - totalTransactions

    let allArraysThatNeedFormats = transactions.concat(recharges)
    for(const movement of allArraysThatNeedFormats){
        movement.timestamp = formatTimeStamp(movement)
    }

    return {balance, transactions, recharges}
}

export async function lockCard(cardId: number, password: string ){
    const card = await getCardById(cardId)
    await validateCardExpiration(card)
 
    if(card.isBlocked){
        throw {type: "Conflict", message: "This card is already locked"}
    }
   
    if(card.password === null){
        throw {type: "Unauthorized", message: "This card was not actived"}
    }

    const decryptPassword =  bcrypt.compareSync(password, card.password)
    if(!decryptPassword){
        throw {type: "Unauthorized", message: "This card password is incorrect"}
    }

    const updateColumn = {isBlocked: true}

    await cardRepository.update(cardId, updateColumn)
}

export async function unlockCard(cardId: number, password: string ){
    const card = await getCardById(cardId)
    await validateCardExpiration(card)

    if(card.isBlocked === false){
        throw {type: "Conflict", message: "This card is not locked"}
    }


    if(card.password === null){
        throw {type: "Unauthorized", message: "This card was not actived"}
    }

   
    const decryptPassword = bcrypt.compareSync(password, card.password)
    if(!decryptPassword){
        throw {type: "Unauthorized", message: "This card password is incorrect"}
    }

    const updateColumn = {isBlocked: false}

    await cardRepository.update(cardId, updateColumn)
}


//util functions

async function getCardById(cardId: number){
    const card = await cardRepository.findById(cardId)
    if(!card){
        throw {type: "NotFound", message: "Card not found"}
    }

    return card
}

async function validateCardExpiration(card: any){
    const actualDate = new Date()
    let arrDate = card.expirationDate.split("/")
    const expirationMonth = Number(arrDate[0])
    const expirationYear = Number(arrDate[1]) + 2000
    const expirationDate = new Date(expirationYear, expirationMonth)

    if(actualDate > expirationDate){
        throw {type: "Conflict", message: "This card has expired"}
    }
}


function formatTimeStamp(movement: any){
    const formatedDate = (movement.timestamp).toLocaleString('pt-BR',{
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })

    return formatedDate
}





   