
import { Request, Response, NextFunction } from "express";


export default function validateSchema(schema: any){
    return (req: Request,  res: Response, next: NextFunction) => {
           const {error} = schema.validate(req.body)
            
            if(error){
                const errors: string[] = error.details.map((detail: any) => detail.message)
                throw {type:"InvalidPayload", message:errors}
            }
        next()
    }
}