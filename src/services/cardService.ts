import * as cardRepository from "../repositories/cardRepository"
import * as paymentRepository from "../repositories/paymentRepository"
import * as rechargeRepository from "../repositories/rechargeRepository"
import Cryptr from "cryptr"
import { time } from "console"

export async function findCardByTypeAndEmployeeId(cardType:cardRepository.TransactionTypes, employeeId:number){
    const card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId)
   
    if(card){
        throw {type: "Conflict", message:"The employee already have a card of this type"}
    }
}

async function getCardById(id: number){
    const card = await cardRepository.findById(id)
    if(!card){
        throw {type: "NotFound", message: "Card not found"}
    }

    return card
}

export async function verifyIsValidateCard(id: number, cvc:number){
 
    const card = await getCardById(id)

    const actualDate = new Date()
    let arrDate = card.expirationDate.split("/")
    const expirationMonth = Number(arrDate[0])
    const expirationYear = Number(arrDate[1]) + 2000
    const expirationDate = new Date(expirationYear, expirationMonth)

    if(actualDate > expirationDate){
        throw {type: "Conflict", message: "This card is no longer valid"}
    }

    if(card.password !== null){
        throw {type: "Conflict", message: "This card is already actived"}
    }

    const cryptr = new Cryptr(process.env.SECRET_KEY)
    const cvcDecrypted = Number(cryptr.decrypt(card.securityCode))
    
    if(cvcDecrypted !== cvc){
        throw {type: "BadRequest", message: "Invalid card data"}
    }

    return card
    
}

export async function activateCard(id: number, columns: object){
    await cardRepository.update(id, columns)
}



export async function getTransactionsAndRecharges(id: number){
    
    const transactions = await paymentRepository.findByCardId(id)
    const recharges: any = await rechargeRepository.findByCardId(id)
 
    const totalTransactions = transactions.reduce((prev: any, curr: any) => prev + curr.amount, 0)
    const totalRecharges = recharges.reduce((prev: any, curr: any) => prev + curr.amount, 0)
    const balance = totalRecharges - totalTransactions


    let allArraysThatNeedFormats = transactions.concat(recharges)
    for(const movement of allArraysThatNeedFormats){
        movement.timestamp = formatTimeStamp(movement)
    }

    return {balance, transactions, recharges}
}


function formatTimeStamp(movement: any){
    const formatedDate = (movement.timestamp).toLocaleString('pt-BR',{
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })

    return formatedDate
}





   