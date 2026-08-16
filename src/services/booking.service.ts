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
import { HistoryService } from "./history.service.js";
import { StorageService } from "./storage.service.js";
import { v4 as uuidv4 } from 'uuid';
import { UserService } from "./user.service.js";

export class BookingService implements IService<BOOKING_TYPE> {

    private auditLogService: AuditLogService
    private historyService: HistoryService

    constructor() {

        this.auditLogService = new AuditLogService()
        this.historyService = new HistoryService(new UserService(), this)

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

        this.historyService.create({
            changed_by: booking.user_id,
            booking_id: booking.id,
            new_status: booking.status,
            action_type: "create",

        })


        return booking
    }
    async update(id: string, data: BOOKING_TYPE) {

        if (!id || !data.customer_id || !data.user_id) {
            console.log("cannot update booking because id, customer_id, and user_id are required!")
            return false
        }

        if (!data.customer_id || !data.user_id || !data.trip_id) {
            console.log("some of fields of data are required! (customer_id|user_id|trip_id)")
            return false
        }




        data.updated_at = new Date().toISOString()
        console.log("[BookingService] update() :", id, data);

        const one: BOOKING_TYPE = await this.getById(data.id!!)
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

        this.historyService.create({
            changed_by: one.user_id,
            booking_id: one.id,
            new_status: data.status,
            previous_status: one.status,
            action_type: "update",

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

        const one: BOOKING_TYPE = await this.getById(id)
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

        this.historyService.create({
            changed_by: one.user_id,
            booking_id: one.id,
            /*new_status: data.status,
            previous_status: one.status,*/
            action_type: "remove",

        })

        return true


    }

    async getAllByTripId(tripId: string): Promise<BOOKING_TYPE[] | any[]> {
        const all = await this.getAll()
         //console.log("[BookingService] getAllByTripId all:", all)

        /*const result =  all.map((m: BOOKING_TYPE) => {
            if(m != undefined && tripId == m.trip_id){
                return m
            }
        })*/

            let result: any[] = []

        for(let i  of all){

            if(i && i != undefined && i.trip_id === tripId){
                result.push(i)
            }

        }

       // console.log("[BookingService] getAllByTripId result:", result)

        return result


    }

    async getSeatNumbers(tripId: string): Promise<number[]> {
        const all = await this.getAllByTripId(tripId)
        //console.log("[BookingService] getSeatNumbers all:", all)
        const result = all.map((m: BOOKING_TYPE) => parseInt(m?.seat_number!!))
        //console.log("[BookingService] getSeatNumbers result:", result)

        return result
    }

}