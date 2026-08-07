/*
trip_id (PK)
bus_id (FK) 
departure
destination
departure_time
arrival_time
status
available_seats
created_by (FK) (user: admin)

*/
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from "./storage.service.js";
import { TRIP_TYPE } from '../types.js';
import { AuditLogService } from './auditlogs.service.js';


export class TripService {

     private auditLogService: AuditLogService
    
        constructor(){
    
            this.auditLogService = new AuditLogService()
    
        }

    async create(data: TRIP_TYPE) {
        console.log("[TripService] create data:", data);

        const trip: TRIP_TYPE = {
            ...data,
            id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        await StorageService.saveInJson("storage", "trips", trip)

         this.auditLogService.create({
            state: "trip",
            action_type: "create",
            description: "created trip",
            //user_id: data.user_id
        })
        
    }

    async update(id: string, data: TRIP_TYPE) {

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


    async getAll(): Promise<TRIP_TYPE[] | any[]> {
        const list = await StorageService.readFromJson("storage", "trips")!!
        //console.log("[TripService] getAll:", list)
        if (typeof (list) == 'undefined' || !list) {
            return []
        }
        return list
    }


    async getById(id: string) {
        const all = await this.getAll()

        const one = all.filter((fl) => fl.id === id)[0]

        if (!one) {
            console.log("trip by id is not found!")
            return {}
        }

        return one
    }


}