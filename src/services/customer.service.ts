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




    async create(data: CUSTOMER_TYPE): Promise<CUSTOMER_TYPE | any> {
        console.log("[CustomerService] create data:", data);

        // check if phone is  existing then return else create customer
        const p: CUSTOMER_TYPE = await this.getByPhone(data.phone!!)
        if (p.id) {
            console.log("cannot create customer because phone is already exisitng")
            return false
        }


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
        if(!id){
            console.log("cannot update customer because no id")
            return false
        }

        data.updated_at = new Date().toISOString()
        console.log("[TripService] update() :", id, data);

        const one = await this.getById(data.id!!)
        if (!one) {
            console.log("cannot update trip because not found")
            return
        }


        console.log("[TripService] update() one:", id, one);

       return await StorageService.updateInJson("storage", "customers", data)

    }
    async getAll(): Promise<CUSTOMER_TYPE[] | any[]> {
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

    private async getByPhone(phone: string) {

        const all = await this.getAll()

        const one = all.filter((fl) => fl.phone === phone)[0]

        if (!one) {
            console.log("customer by phone is not found!")
            return {}
        }

        return one


    }





}