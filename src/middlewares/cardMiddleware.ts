import { Request, Response } from "express";

import * as employeeRepository from "../repositories/employeeRepository"


export default async function validateAPIKey(req: Request,  res: Response, next: any){
    const APIKey = req.headers.apikey
    const {employeeId} = req.body

    if(!APIKey){
        throw {type: "NotFound", message:"Insert a valid APIKey"}
    }

    const employee = await employeeRepository.findById(employeeId)
    if(!employee){
        throw {type: "NotFound", message:"Employee not found"}
    }

    const card = await 

    next()

}