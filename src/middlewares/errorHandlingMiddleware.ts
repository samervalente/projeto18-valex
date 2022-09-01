import { Request, Response, NextFunction } from "express";

export default async function errorHandlingMiddleware(error: any, req: Request, res: Response, next: NextFunction){
    const {type} = error
  
    switch(type){
        case "NotFound": return res.status(404).send(error.message) 
        case "InvalidPayload": return res.status(422).send(error.message)
        case "Conflict": return res.status(409).send(error.message)
    }
    
    console.log(error)
    return res.sendStatus(500)

}