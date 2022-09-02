import { Request, Response } from "express";
import { faker } from '@faker-js/faker';
import  dayjs from 'dayjs'
import Cryptr from "cryptr"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import * as companieService from "../services/companieService"
import * as cardService from "../services/cardService"
import * as cardRepository from "../repositories/cardRepository"
import * as employeeService from "../services/employeeService"
import formatEmployeeName from "../utils/format";

dotenv.config()

export  async function createCard(req: Request, res: Response){
    const APIKey = res.locals.APIKEY
 
    const {cardType, employeeId} = req.body
    const cryptr = new Cryptr(process.env.SECRET_KEY)

    //Validate service
    await companieService.validateAPIKey(APIKey)
    await cardService.findCardByTypeAndEmployeeId(cardType, employeeId)

     //Create card data
    const number = faker.finance.creditCardNumber()
    const securityCode = cryptr.encrypt(faker.finance.creditCardCVV())

    const date = (`${dayjs().year() + 5 }-${dayjs().month() + 1}`)
    const expirationDate = dayjs(date).format("MM/YY")

    const {fullName} = await employeeService.getEmployeeById(employeeId)
    const cardholderName = formatEmployeeName(fullName).trim()
    
    const Card = {
      employeeId,
      number,
      cardholderName,
      securityCode: securityCode,
      expirationDate,
      password: null,
      isVirtual: false,
      originalCardId: null,
      isBlocked: true,
      type: cardType
    }

    await cardRepository.insert(Card)

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

  return res.status(200).send("Sucess. The card was blocked")
}

export async function unlockCard(req: Request, res: Response){
  const {cardId, password} = req.body
  
  await cardService.unlockCard(cardId, password)
  
  return res.status(200).send("Sucess. The card was unlock")
}