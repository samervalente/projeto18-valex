import * as employeeRepository from "../repositories/employeeRepository"

export async function getEmployeeById(id: number){
    const employee = await employeeRepository.findById(id)
    console.log(employee
        )
    if(!employee){
        throw {type: "NotFound", message:"Employee not found"}
    }

    return employee

}