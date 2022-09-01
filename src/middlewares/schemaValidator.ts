
import { Request, Response } from "express";


export default function validateSchema(schema: any){
    return (req: Request,  res: Response, next: any) => {
           const {error} = schema.validate(req.body)
            
            if(error){
                const errors: string[] = error.details.map((detail: any) => detail.message)
                throw {type:"InvalidPayload", message:errors}
            }
        next()
    }
}