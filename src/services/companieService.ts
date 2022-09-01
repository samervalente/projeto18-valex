import * as companieService from "../repositories/companyRepository"

 export async function validateAPIKey(APIKey:string){
  
    const companie = await companieService.findByApiKey(APIKey)
 
    if(!companie){
        throw {type: "NotFound", message:`Could not find specified company by this API KEY`}
    }

    return companie
}


