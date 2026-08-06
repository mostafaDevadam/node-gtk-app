/*
bus_id (PK)
bus_number
capacity
bus_type
chair_count
created_at


*/

import { BUS } from "../types.js";
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from "./storage.service.js";

export class BusService {

    async create(data: BUS) {
        console.log("[BusService] create data:", data);

        const bus: BUS = {
            ...data,
            id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        await StorageService.saveInJson("storage", "buses", bus)
    }

    async update(id: string, data: BUS) {

        data.updated_at = new Date().toISOString()
        console.log("[BusService] update() :", id, data);

        const one = await this.getById(data.id!!)
        if (!one) {
            console.log("cannot update bus because not found")
            return
        }


        console.log("[BusService] update() one:", id, one);

        await StorageService.updateInJson("storage", "buses", data)

        await StorageService.removeInJson("storage", "buses", data.id)



    }

    async getAll(): Promise<BUS[] | any[]> {
        const list = await StorageService.readFromJson("storage", "buses")!!
        console.log("[BusService] get_all:", list)
        if (typeof (list) == 'undefined' || !list) {
            return []
        }
        return list
    }


    async getById(id: string) {
        const all = await this.getAll()

        const one = all.filter((fl) => fl.id === id)[0]

        if (!one) {
            console.log("bus by id is not found!")
            return {}
        }

        return one
    }

    async remove(id: string){
        // if bus has trip then send notify to mitarbeiter
        
    }
}