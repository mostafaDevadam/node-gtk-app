import {Adw, GLib, Gio, Gtk} from '../index.js'
import { AuthInstance, AuthService } from '../services/auth.service.js';






export class LeftSidebar extends Gtk.Box {

    authService: AuthService
    app: any
    private label: any

    constructor(app: any){
        super({
             orientation: Gtk.Orientation.VERTICAL,
            spacing: 6,
            marginTop: 24,
            marginBottom: 24,
            marginStart: 24,
            marginEnd: 24,

        })
        this.app = app

        this.authService = new AuthService()
        
        this.setSizeRequest(200, -1)


        console.log("left-sidebar:", app.active_username, AuthInstance.loggedIn_user)

        this.label = new Gtk.Label({ label: "welcome"})
        this.append(this.label);

        if (this.app.active_username) {
            this.updateLeftLabel(this.app.active_username);
        }

    }

    public updateLeftLabel(username: string) {
        this.label.setText(`${username}`)
        //this.label.text = `left_sidebar - ${AuthInstance.loggedIn_user.name}`
    }


}

