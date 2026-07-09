import { AUTH, USER } from "../types.js";
import { UserService } from "./user.service.js";


export class AuthService {
    private userService: UserService
    loggedIn_user: USER = {}
    isAuth = false

    constructor(){
        this.userService = new UserService()
        
    }

    async login(data: AUTH){
        const user = await this.userService.getUserByEmail(data.email)
        if(!user){
            console.log("Error login cannot login and user not existing!")
            this.isAuth = false
            return {}
        }

        if(user.password !== data.password){
             console.log("Error login cannot login and password is incorrect!")
             this.isAuth = false
            return {}
        }

        this.loggedIn_user = user
        this.isAuth = true

        return user
    }
}

export const AuthInstance = new AuthService()