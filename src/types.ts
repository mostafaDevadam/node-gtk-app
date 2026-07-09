import { UserRole } from "./enums.js"

export type AUTH = {
   name?: string
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