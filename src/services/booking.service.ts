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
import { AuditLogService } from "./auditlogs.service.js";
import { StorageService } from "./storage.service.js";
import { v4 as uuidv4 } from 'uuid';

export class BookingService implements IService<BOOKING_TYPE> {

    private auditLogService: AuditLogService

    constructor() {

        this.auditLogService = new AuditLogService()

    }

    async create(data: BOOKING_TYPE): Promise<BOOKING_TYPE | any> {
        console.log("[BookingService] create data:", data);

        if (!data.customer_id || !data.user_id || !data.trip_id) {
            console.log("some of fields of data are required! (customer_id|user_id|trip_id)")
            return false
        }

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

        this.auditLogService.create({
            state: "booking",
            action_type: "create",
            description: "created booking",
            user_id: data.user_id
        })


        return booking
    }
    async update(id: string, data: BOOKING_TYPE) {

        if (!id) {
            console.log("cannot update booking because no id")
            return false
        }

        if (!data.customer_id || !data.user_id || !data.trip_id) {
            console.log("some of fields of data are required! (customer_id|user_id|trip_id)")
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


        this.auditLogService.create({
            state: "booking",
            action_type: "update",
            description: "updated booking",
            user_id: data.user_id
        })

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

    async remove(id: string): Promise<Boolean> {

        if (!id) {
            console.log("id is required!")
            return false
        }

        const one = await this.getById(id)
        if (!one) {
            console.log("no booking found!")
            return false
        }


        await StorageService.removeInJson("storage", "bookings", id)



        this.auditLogService.create({
            state: "booking",
            action_type: "remove",
            description: "removed booking",
            user_id: id
        })

        return true


    }

}