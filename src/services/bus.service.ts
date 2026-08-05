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

    async create(data: BUS){
          console.log("[BusService] create data:", data);  

          const bus: BUS = {
            ...data,
            id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          await StorageService.saveInJson("storage", "buses", bus)
    }

     async get_all(): Promise<BUS[] | any[]> {
            const list = await StorageService.readFromJson("storage", "buses")!!
            console.log("[BusService] get_all:", list)
            if(typeof(list) == 'undefined' || !list) {
                return []
            }
            return list
        }
}