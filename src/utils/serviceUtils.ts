import * as cardRepository from "../repositories/cardRepository"
import * as paymentRepository from "../repositories/paymentRepository"
import * as rechargeRepository from "../repositories/rechargeRepository"

import bcrypt from "bcrypt"

export async function getCardById(cardId: number){
    const card = await cardRepository.findById(cardId)
    if(!card){
        throw {type: "NotFound", message: "Card not found"}
    }

    return card
}

export async function validateCardExpiration(card: any){
    const actualDate = new Date()
    let arrDate = card.expirationDate.split("/")
    const expirationMonth = Number(arrDate[0])
    const expirationYear = Number(arrDate[1]) + 2000
    const expirationDate = new Date(expirationYear, expirationMonth)

    if(actualDate > expirationDate){
        throw {type: "Conflict", message: "This card has expired"}
    }
}

export async function validateCardPassword(card, password){
    const isPasswordCorrect = bcrypt.compareSync(password, card.password)

    if(!isPasswordCorrect){
        throw {type: "Unauthorized", message: "This card password is incorrect"}
    } 
}

export async function getCardMovements(cardId: number){
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

function formatTimeStamp(movement: any){
    const formatedDate = (movement.timestamp).toLocaleString('pt-BR',{
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })

    return formatedDate
}
