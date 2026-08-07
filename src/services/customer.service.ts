/*
customer_id(PK)
name
phone (unique) 
email
address
created_at

*/

import { IService } from "../interfaces.js";
import { CUSTOMER_TYPE } from "../types.js";
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from "./storage.service.js";
export class CustomerService implements IService<CUSTOMER_TYPE> {

    


    async create(data: CUSTOMER_TYPE): Promise<CUSTOMER_TYPE> {
        console.log("[CustomerService] create data:", data);

        const customer: CUSTOMER_TYPE = {
            ...data,
            id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        await StorageService.saveInJson("storage", "customers", customer)
        return customer
    }
    async update(id: string, data: CUSTOMER_TYPE) {
        data.updated_at = new Date().toISOString()
        console.log("[TripService] update() :", id, data);

        const one = await this.getById(data.id!!)
        if (!one) {
            console.log("cannot update trip because not found")
            return
        }


        console.log("[TripService] update() one:", id, one);

        await StorageService.updateInJson("storage", "trips", data)
       
    }
    async getAll(): Promise<CUSTOMER_TYPE[] | any[]>  {
         const list = await StorageService.readFromJson("storage", "customers")!!
        //console.log("[TripService] getAll:", list)
        if (typeof (list) == 'undefined' || !list) {
            return []
        }
        return list as CUSTOMER_TYPE[]
        
    }
    async getById(id: string) {
         const all = await this.getAll()

        const one = all.filter((fl) => fl.id === id)[0]

        if (!one) {
            console.log("customer by id is not found!")
            return {}
        }

        return one
        
    }
    remove(): void {
        
    }





}