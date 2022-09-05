import { Request, Response, NextFunction } from "express";
export async function validateRechargeData(req: Request, res: Response, next: NextFunction){
    const APIKey = req.headers["x-api-key"]
    const {amount} = req.body

    if(!APIKey){
        throw {type: "BadRequest", message:"Insert a valid APIKey"}
    }

    if(amount <= 0 ){
        throw {type: "BadRequest", message: "Only values greater than 0 are acceptable"}
    }

    next()
}