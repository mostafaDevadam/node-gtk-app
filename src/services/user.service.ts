import { UserRole } from "../enums.js";
import { AUTH, USER } from "../types.js"
import { StorageService } from "./storage.service.js"
import { v4 as uuidv4 } from 'uuid';

export class UserService {

    



    async get_users(): Promise<USER[] | any[]> {
        const list = await StorageService.readFromJson("storage", "users")!!
        console.log("list:", list)
        if(typeof(list) == 'undefined' || !list) {
            return []
        }
        return list
    }

    async create_user(data: AUTH){
          const user: USER = {
            ...data,
            id: uuidv4(),
            //role: UserRole.employee,
            created_at: new Date().toISOString(),
          }
          await StorageService.saveInJson("storage", "users", user)
    }

    async getUserByEmail(email: string): Promise<USER | any>{
          const users = await this.get_users()

         const one = users.filter((fl) => fl.email === email)[0]

         if(!one){
            console.log("user by email is not found!")
            return {}
         }

         return one
    }

     async getUserById(id: string){
          const users = await this.get_users()

         const one = users.filter((fl) => fl.id === id)[0]

         if(!one){
            console.log("user by id is not found!")
            return {}
         }

         return one
    }

}