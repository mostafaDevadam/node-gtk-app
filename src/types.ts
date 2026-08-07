import { UserRole } from "./enums.js"

export type AUTH = {
   name?: string
   role: UserRole
   email: string
   password: string
}

export type USER = {
   id?: string,
   name?: string,
   email?: string,
   password?: string
   role?: UserRole,
   created_at?: string
   updated_at?: string
}

export type BUS = {
   id?: string
   userId?: string
   bus_number?: number
   capacity?: number
   bus_type?: string
   chair_count?: number
   created_at?: string
   updated_at?: string
}

export type TRIP_TYPE = {
   id?: string
   bus_id: string
   departure?: string
   destination?: string
   departure_time?: string
   arrival_time?: string
   status?: string
   available_seats?: string
   created_at?: string
   updated_at?: string

}

export type CUSTOMER_TYPE = {
   id?: string
   name?: string
   phone?: string
   email?: string
   address?: string
   created_at?: string
   updated_at?: string
}

export type BOOKING_TYPE = {
   id?: string
   trip_id: string
   customer_id: string
   user_id: string
   booking_number?: string
   seat_number?: string
   booking_date?: string
   status?: string
   price?: string
   payment_status?: string
   created_at?: string
   updated_at?: string

   customer?: CUSTOMER_TYPE
}


export type AUDIT_LOG_TYPE = {
   id?: string
   user_id?: string
   action_type?: "create" | "update" | "remove" | "export" | "login" | "logout" | "register"
   state: "booking" | "user" | "trip" | "bus" | "customer" | "profile"
   description?: string
   //timestamp
   //ip_address
   details?: {} | any
   created_at?: string
}