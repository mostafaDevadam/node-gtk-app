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
import { AuditLogService } from "./auditlogs.service.js";

export class BusService {

     private auditLogService: AuditLogService
    
        constructor(){
    
            this.auditLogService = new AuditLogService()
    
        }

    async create(data: BUS) {
        console.log("[BusService] create data:", data);

        const bus: BUS = {
            ...data,
            id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        this.auditLogService.create({
            state: "bus",
            action_type: "create",
            description: "created bus",
            //user_id: data.user_id
        })





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

         this.auditLogService.create({
            state: "bus",
            action_type: "update",
            description: "updated bus",
            user_id: data.userId
        })

        await StorageService.updateInJson("storage", "buses", data)

        



    }

    async getAll(): Promise<BUS[] | any[]> {
        const list = await StorageService.readFromJson("storage", "buses")!!
        //console.log("[BusService] get_all:", list)
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