/*
history_id(PK) 
booking_id(FK)
action_type
previous_status
new_status
changed_by(FK)
timestamp
remarks




*/

import { IService } from "../interfaces.js";
import { HISTORY_TYPE } from "../types.js";
import { BookingService } from "./booking.service.js";
import { StorageService } from "./storage.service.js";
import { UserService } from "./user.service.js";
import { v4 as uuidv4 } from 'uuid';

export class HistoryService implements IService<HISTORY_TYPE>{

     userService: UserService
    private bookingService: BookingService

    constructor(userService: UserService, bookingService: BookingService){

        this.userService = userService
        this.bookingService = bookingService

    }


    async create(data: HISTORY_TYPE): Promise<HISTORY_TYPE | any>{
        if(!data.booking_id || !data.changed_by){
            console.log("cannot create history because booking_id and chnaged_by are required!")
            return false
        }

        // check user
        const changed_by = await this.userService.getUserById(data.changed_by)
        if(!changed_by){
            console.log("cannot create history because user/changed_by is not found!")
            return false
        }


        // check booking
        const booking = await this.bookingService.getById(data.booking_id)
        if(!booking){
            console.log("cannot create history because booking is not found!")
            return false
        }
        //
        const history: HISTORY_TYPE = {
            ...data,
            id: uuidv4(),
            created_at: new Date().toISOString(),

        }

        //
        await StorageService.saveInJson("storage", "historys", history)
        return history

        
    }

    update(id: string, data: HISTORY_TYPE) {
    }

    async getAll(): Promise<any[] | HISTORY_TYPE[]> {
        const list = await StorageService.readFromJson("storage", "historys")!!
                //console.log("[TripService] getAll:", list)
                if (typeof (list) == 'undefined' || !list) {
                    return []
                }
                return list as HISTORY_TYPE[]
        
    }

    async getById(id: string) {
          const all = await this.getAll()

        const one = all.filter((fl) => fl.id === id)[0]

        if (!one) {
            console.log("history by id is not found!")
            return {}
        }

        return one
        
    }

    remove(id: string): void {
        
    }



}