import { Request, Response } from "express";
import { faker } from '@faker-js/faker';
import  dayjs from 'dayjs'
import Cryptr from "cryptr"
import * as companieService from "../services/companieService"
import * as cardService from "../services/cardService"
import * as cardRepository from "../repositories/cardRepository"
import * as employeeService from "../services/employeeService"
import formatEmployeeName from "../utils/format";

export default async function createCard(req: Request, res: Response){
    const APIKey: any = req.headers.apikey
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
    const cardholderName = formatEmployeeName(fullName)
    
    const Card = {
      employeeId,
      number,
      cardholderName,
      securityCode: securityCode,
      expirationDate,
      password: null,
      isVirtual: true,
      originalCardId: null,
      isBlocked: true,
      type: cardType
    }

    await cardRepository.insert(Card)

    res.status(201).send("Success. The card was created")
}

