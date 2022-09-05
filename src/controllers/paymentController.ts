import {Request, Response} from "express"
import * as paymentService from "../services/paymentService"

export async function paymentInPOS(req: Request, res: Response){
    const paymentData = res.locals.paymentData
   
    await paymentService.purchaseInPos(paymentData)

    res.status(200).send("Payment was successful")
}