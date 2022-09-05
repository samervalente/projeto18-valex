import {Request, Response} from "express"
import * as rechargeService from "../services/rechargeService"


export async function rechargeCard(req: Request, res: Response){
    const rechargeData = {cardId:req.params.id, amount: req.body.amount}
  
    await rechargeService.rechargeCard(rechargeData)

    return res.status(200).send("Sucess. The card was recharged")

}