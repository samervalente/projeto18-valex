import { Request, Response } from "express";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import * as companieService from "../services/companieService"
import * as cardService from "../services/cardService"

dotenv.config()

export  async function createCard(req: Request, res: Response){
    const APIKey = res.locals.APIKEY
    const {cardType, employeeId} = req.body
    
    await companieService.validateAPIKey(APIKey)
    await cardService.findCardByTypeAndEmployeeId(cardType, employeeId)
    await cardService.createCard(cardType, employeeId)
    
    res.status(201).send("Success. The card was created!")
}

export async function activateCard(req: Request, res: Response){
  const {password, cardId, CVC} = req.body
  const updateColumns = {password: bcrypt.hashSync(password, 10)}

  await cardService.activateCard(cardId, CVC, updateColumns)

  return res.status(200).send("Sucess. The card was actived!")

}

export async function getCardTransactions(req: Request, res: Response){
  const {id} = req.params

  const cardMovements = await cardService.getTransactionsAndRecharges(Number(id))

  return res.status(200).send(cardMovements)
}


export async function lockCard(req: Request, res: Response){
  const {cardId, password} = req.body
  
  await cardService.lockCard(cardId, password)

  return res.status(200).send("Sucess. The card was locked")
}

export async function unlockCard(req: Request, res: Response){
  const {cardId, password} = req.body
  
  await cardService.unlockCard(cardId, password)
  
  return res.status(200).send("Sucess. The card was unlocked")
}