

import {Adw, GLib, Gio, Gtk} from '../index.js'
import { AuthForm } from './forms/auth_form.js'


export class AuthComponent extends Gtk.Stack{

    app: any

    constructor(app: any) {
       
       super({transitionType: Gtk.StackTransitionType.NONE})

       this.app = Adw.Application
       this.app = app


        // test login box
        const login_box = new AuthForm(app, "Login", false, () => {
            this.submit_login()
        })

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
         const register_box = new AuthForm(app, "Register", true,() => {
            this.submit_register()
        })
        this.addNamed(register_box, "register_layout")
        this.app.root_navigation_stack.setVisibleChildName("main_layout")
        this.app.outer_split_view.setVisible(false)

      

       
    }


    submit_login() {
          console.log("login-btn...1")
          if(this.app) {
            this.app.outer_split_view.setVisible(true)
            this.app.root_navigation_stack.setVisibleChildName("main_layout")
          }
    }

    submit_register(){
         this.app.outer_split_view.setVisible(false)
         this.setVisibleChildName("login_layout")
    }

}