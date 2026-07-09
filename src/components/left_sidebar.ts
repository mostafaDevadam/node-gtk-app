import {Adw, GLib, Gio, Gtk} from '../index.js'



export class LeftSidebar extends Gtk.Box {

    constructor(){
        super({
             orientation: Gtk.Orientation.VERTICAL,
            spacing: 6,
            marginTop: 24,
            marginBottom: 24,
            marginStart: 24,
            marginEnd: 24,
        

        })
        
        this.setSizeRequest(200, -1)
        this.append(new Gtk.Label({ label: 'left_sidebar!' }));


    }
}