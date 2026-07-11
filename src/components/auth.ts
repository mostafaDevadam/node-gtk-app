

import { join } from 'path'
import {Adw, GLib, Gio, Gtk} from '../index.js'
import { AUTH } from '../types.js'
import { AuthForm } from './forms/auth_form.js'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { StorageService } from '../services/storage.service.js'
import { UserService } from '../services/user.service.js'
import { AuthInstance, AuthService } from '../services/auth.service.js'

export class AuthComponent extends Gtk.Stack{

    app: any
    userService: UserService
    authService: AuthService

    constructor(app: any) {
       
       super({transitionType: Gtk.StackTransitionType.NONE})

       this.app = Adw.Application
       this.app = app
       this.userService = new UserService()
       this.authService = new AuthService()


        // test login box
        const login_box = new AuthForm(app, "Login", false, (data: AUTH) => {
            this.submit_login(data)
        })

        this.app.refresh_role_row(login_box.role_model, login_box.role_row)

        //login_box.append(new Gtk.Label({ label: 'test-login!' }));
        this.addNamed(login_box, "login_layout")
        this.app.root_navigation_stack.setVisibleChildName("auth_layout")
        //root_navigation_stack.setVisibleChildName("login_layout")
        this.app.outer_split_view.setVisible(false)

      
        

        const test_to_register_btn = new Gtk.Button({
          label: "to register",

        })

        test_to_register_btn.on("clicked", () => {
          console.log("test-btn...1")
          this.app.outer_split_view.setVisible(true)
          this.setVisibleChildName("register_layout")
          this.app.root_navigation_stack.setVisibleChildName("auth_layout")
        })

        login_box.append(test_to_register_btn)


        // test register box
         const register_box = new AuthForm(app, "Register", true,(data: AUTH) => {
            this.submit_register(data)
        })
        this.addNamed(register_box, "register_layout")
        this.app.root_navigation_stack.setVisibleChildName("main_layout")
        this.app.outer_split_view.setVisible(false)


         const to_login_btn = new Gtk.Button({
          label: "to login",

        })

        to_login_btn.on("clicked", () => {
          console.log("to_login_btn...1")
          this.app.outer_split_view.setVisible(false)
          this.setVisibleChildName("login_layout")
          this.app.root_navigation_stack.setVisibleChildName("auth_layout")
        })

        register_box.append(to_login_btn)

      

       
    }


    async submit_login(data: AUTH) {
        if(!data || !data.role || !data.email || !data.password){
            console.log("cannot submit login because no data"); 
            return
        }
          console.log("submit-login:", data)
          // get data from json file
          // get data
          /*const list = await this.userService.get_users()
          console.log("list:", list)

          const u1 = await this.userService.getUserByEmail(data.email)
          console.log("u1:", u1)

          const u2 = await this.userService.getUserById(u1.id)
          console.log("u2:", u2)*/

          // save data in json file

          //
          //const user = await this.authService.login(data)
          //const user = await AuthInstance.login(data)
          const user = await this.authService.login(data)

          if(!user){
            console.log("user is not found!!")
            this.app.showToast("Cannot login!")
            this.app.isAuth = false
            return
          }

          console.log("logged-in user:", user)

          if(this.app && user) {
             this.app.logout_btn.setVisible(true)
            this.app.isAuth = true
            console.log("this.app user:", user, user.name, user?.role)
            this.app.active_user = user
            this.app.active_username = user.name
            this.app.active_user_role = user.role
            //AuthInstance.loggedIn_user = user
            if(this.app.left_sidebar){
              this.app.left_sidebar.updateLeftLabel(user.name)
            }
            // create auto-login
            const config_data = {
                "auto_login": true,
                "saved_email": user.email,
            }
            StorageService.saveData("storage", "config", config_data)
            //StorageService.saveInJson("storage", "config", config_data)
            //
            console.log("this.app  AuthInstance.loggedIn_user:",  AuthInstance.loggedIn_user)
            this.app.outer_split_view.setVisible(true)
            this.app.root_navigation_stack.setVisibleChildName("main_layout")
          }
    }

    async submit_register(data: AUTH){
        if(!data || !data.role || !data.email || !data.password){
            console.log("cannot submit register because no data"); 
            return
        }
         // get data from json file
         const existing = await this.userService.getUserByEmail(data.email)
         if(existing){
           console.log("user is already existing!")
           this.app.showToast("user or email is already existing!")
          return
         }
         // save data in json file
         await this.userService.create_user(data)
         //
         console.log("submit-register:", data)
         this.app.outer_split_view.setVisible(false)
         this.setVisibleChildName("login_layout")
         
         
    }

}