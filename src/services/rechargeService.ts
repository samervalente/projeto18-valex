import * as rechargeRepository from "../repositories/rechargeRepository"
import * as serviceUtils from "../utils/serviceUtils"

export async function rechargeCard(rechargeData: any){
    const {cardId} = rechargeData

    const card = await serviceUtils.getCardById(cardId)
    
    if(card.password === null){
        throw {type: "Conflict", message: "This card isn't active"}
    }

    await serviceUtils.validateCardExpiration(card)
    await rechargeRepository.insert(rechargeData)

}