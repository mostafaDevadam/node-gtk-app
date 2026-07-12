import {Adw, GLib, Gio, Gtk} from '../index.js'



export class BusesComponent {

   app: any

  constructor(app: any){
     this.app = app
  }

  build_trips_view(){

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        const lbl = new Gtk.Label({label: "Buses#"})
        box.append(lbl)

        if(this.app.active_user_role == "admin"){
         const btn = new Gtk.Button({label: "Add"})
         box.append(btn)
        }



        
       
        this.app.template_view.build_template_view("Buses","home_buses_view", box)

  }

}
