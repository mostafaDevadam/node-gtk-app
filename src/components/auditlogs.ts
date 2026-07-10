
import {Adw, GLib, Gio, Gtk} from '../index.js'


export class AuditLogsComponent {

   app: any

  constructor(app: any){
     this.app = app
  }

  build_logs_view(){

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        const lbl = new Gtk.Label({label: "AuditLogs#"})
        box.append(lbl)



        
       
        this.app.template_view.build_template_view("AuditLogs","home_audit_logs_view", box)

  }

}


