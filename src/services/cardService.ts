import * as cardRepository from "../repositories/cardRepository"
import Cryptr from "cryptr"

export async function findCardByTypeAndEmployeeId(cardType:cardRepository.TransactionTypes, employeeId:number){
    const card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId)
   
    if(card){
        throw {type: "Conflict", message:"The employee already have a card of this type"}
    }
}

export async function verifyIsValidateCard(id: number, cvc:number){
 
    const card = await cardRepository.findById(id)
    if(!card){
        throw {type: "NotFound", message: "Card not found"}
    }

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





   