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
   bus_number?: number
   capacity?: number
   bus_type?: string
   chair_count?: number
   created_at?: string
   updated_at?: string
}