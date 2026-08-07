/*
booking_id(PK)
trip_id (FK)
customer_id(FK)
user_id (FK)
seat_number
booking_date
status
price
payment_status
created_at
updated_at

*/

import { IService } from "../interfaces.js";
import { BOOKING_TYPE } from "../types.js";
import { StorageService } from "./storage.service.js";
import { v4 as uuidv4 } from 'uuid';

export class BookingService implements IService<BOOKING_TYPE> {

    async create(data: BOOKING_TYPE): Promise<BOOKING_TYPE> {
        console.log("[BookingService] create data:", data);

        // check if user is existing
        // check if customer is existing


        const booking: BOOKING_TYPE = {
            ...data,
            id: uuidv4(),
            booking_number: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        await StorageService.saveInJson("storage", "bookings", booking)
        return booking
    }
    async update(id: string, data: BOOKING_TYPE) {

        if (!id) {
            console.log("cannot update booking because no id")
            return false
        }




        data.updated_at = new Date().toISOString()
        console.log("[BookingService] update() :", id, data);

        const one = await this.getById(data.id!!)
        if (!one) {
            console.log("cannot update trip because not found")
            return
        }


        console.log("[BookingService] update() one:", id, one);

        return await StorageService.updateInJson("storage", "bookings", data)

    }
    async getAll(): Promise<BOOKING_TYPE[] | any[]> {
        const list = await StorageService.readFromJson("storage", "bookings")!!
        //console.log("[TripService] getAll:", list)
        if (typeof (list) == 'undefined' || !list) {
            return []
        }
        return list as BOOKING_TYPE[]

    }
    async getById(id: string) {
        const all = await this.getAll()

        const one = all.filter((fl) => fl.id === id)[0]

        if (!one) {
            console.log("booking by id is not found!")
            return {}
        }

        return one

    }
    remove(): void {

    }

}