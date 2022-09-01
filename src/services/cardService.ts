import * as cardRepository from "../repositories/cardRepository"


export async function findCardByTypeAndEmployeeId(cardType:cardRepository.TransactionTypes, employeeId:number){
    const card = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId)
   
    if(card){
        throw {type: "Conflict", message:"The employee already have a card of this type"}
    }
}
