import * as paymentRepository from "../repositories/paymentRepository"
import * as businessRepository from "../repositories/businessRepository"
import * as serviceUtils from "../utils/serviceUtils"


export async function purchaseInPos(purcharseData: any){
    
    const card = await serviceUtils.getCardById(purcharseData.cardId)
    
    if(card.password === null){
        throw {type: "Conflict", message: "The card isn't active"}
    }

    await serviceUtils.validateCardExpiration(card)

    if(card.isBlocked){
        throw {type: "Conflict", message: "The card is locked"}
    }

    await serviceUtils.validateCardPassword(card, purcharseData.password)

    const businnes = await businessRepository.findById(purcharseData.businessId)
    if(!businnes){
        throw {type: "NotFound", message: "Business not found"}
    }

    if(card.type !== businnes.type){
        throw({type: "Conflict", message: "The card and business type are different"})
    }
    
   const {balance} = await serviceUtils.getCardMovements(card.id)
   if(purcharseData.amount > balance){
    throw({type: "BadRequest", message: "The card does not have enough balance"})
   }
  
   delete purcharseData.password
   await paymentRepository.insert(purcharseData)
    
}