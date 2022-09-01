import * as employeeRepository from "../repositories/employeeRepository"

export async function getEmployeeById(id: number){
    const employee = await employeeRepository.findById(id)

    return employee

}