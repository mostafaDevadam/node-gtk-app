import { AUTH, USER } from "../types.js";
import { AuditLogService } from "./auditlogs.service.js";
import { UserService } from "./user.service.js";


export class AuthService {
    private userService: UserService
    loggedIn_user: USER = {}
    isAuth = false
    private auditLogService: AuditLogService

    constructor(){
        this.userService = new UserService()
         this.auditLogService = new AuditLogService()
    }

    
    
       

    async login(data: AUTH){
        const user: USER = await this.userService.getUserByEmail(data.email)
        if(!user){
            console.log("Error login cannot login and user not existing!")
            this.isAuth = false
            return null
        }

        if(user.password !== data.password){
             console.log("Error login cannot login and password is incorrect!")
             this.isAuth = false
            return null
        }

        this.loggedIn_user = user
        this.isAuth = true

         this.auditLogService.create({
            state: "user",
            action_type: "login",
            description: "login user",
            user_id: user.id
        })

        return user
    }

    async logout(userId: string): Promise<Boolean>{
        if(!userId){
            console.log("userId is required!")
            return false
        }

         const user: USER = await this.userService.getUserById(userId)

         if(!user){
            console.log("cannot lagout because no user found!")
            return false
         }

           this.auditLogService.create({
            state: "user",
            action_type: "logout",
            description: "logout user",
            user_id: user.id
        })

        return true

    }
}

export const AuthInstance = new AuthService()