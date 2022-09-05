import { Request, Response, NextFunction } from "express";


export async function validatePurchaseData(req: Request,  res: Response, next: NextFunction){
    const paymentData = req.body

    if(paymentData.amount <= 0 ){
        throw {type: "BadRequest", message: "Only values greater than 0 are acceptable"}
    }
   
    res.locals.paymentData = paymentData
    next()
}