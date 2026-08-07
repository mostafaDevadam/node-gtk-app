import { UserRole } from "../enums.js";
import { AUTH, USER } from "../types.js"
import { AuditLogService } from "./auditlogs.service.js";
import { StorageService } from "./storage.service.js"
import { v4 as uuidv4 } from 'uuid';
/*
user_id (PK)
username
password_hash
email
role (emp/admin)
created_at


*/
export class UserService {

    private auditLogService: AuditLogService

    constructor() {

        this.auditLogService = new AuditLogService()

    }

    
    async get_users(): Promise<USER[] | any[]> {
        const list = await StorageService.readFromJson("storage", "users")!!
        console.log("list:", list)
        if (typeof (list) == 'undefined' || !list) {
            return []
        }
        return list
    }

    async create_user(data: AUTH) {
        const user: USER = {
            ...data,
            id: uuidv4(),
            //role: UserRole.employee,
            created_at: new Date().toISOString(),
        }
        await StorageService.saveInJson("storage", "users", user)

        this.auditLogService.create({
            state: "user",
            action_type: "create",
            description: "created user",
            user_id: user.id
        })
    }

    async getUserByEmail(email: string): Promise<USER | any> {
        const users = await this.get_users()

        const one = users.filter((fl) => fl.email === email)[0]

        if (!one) {
            console.log("user by email is not found!")
            return null
        }

        return one
    }

    async getUserById(id: string) {
        const users = await this.get_users()

        const one = users.filter((fl) => fl.id === id)[0]

        if (!one) {
            console.log("user by id is not found!")
            return {}
        }

        return one
    }

    async update(id: string, data: USER) {

        if(!id || !data.id){
            console.log("id is required!")
            return
        }

        data.updated_at = new Date().toISOString()
        console.log("[UserService] update() :", id, data);

        const one = await this.getUserById(id)
        if (!one) {
            console.log("cannot update user because not found")
            return
        }


        console.log("[UserService] update() one:", id, one);

          this.auditLogService.create({
            state: "user",
            action_type: "create",
            description: "created user",
            user_id: id
        })

        await StorageService.updateInJson("storage", "users", data)
    }

}