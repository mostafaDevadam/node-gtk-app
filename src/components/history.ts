
import {Adw, GLib, Gio, Gtk} from '../index.js'


export class HistoryComponent {

   app: any

  constructor(app: any){
     this.app = app
  }

  build_history_view(){

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        const lbl = new Gtk.Label({label: "History#"})
        box.append(lbl)



        
       
        this.app.template_view.build_template_view("History","home_history_view", box)

  }

}