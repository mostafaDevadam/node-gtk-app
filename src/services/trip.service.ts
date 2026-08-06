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


export class TripService {

    async create(data: TRIP_TYPE) {
        console.log("[TripService] create data:", data);

        const trip: TRIP_TYPE = {
            ...data,
            id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        await StorageService.saveInJson("storage", "trips", trip)
    }


    async getAll(): Promise<TRIP_TYPE[] | any[]> {
        const list = await StorageService.readFromJson("storage", "trips")!!
        console.log("[TripService] getAll:", list)
        if (typeof (list) == 'undefined' || !list) {
            return []
        }
        return list
    }


}