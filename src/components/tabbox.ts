

import { UserRole } from '../enums.js'
import {Adw, GLib, Gio, Gtk} from '../index.js'

export class TabBoxComponent extends Gtk.Box {

  app: any
  page_wrapper: any
  key: string = ""

  constructor(app: any, wrapper_title: string, key: string, icon_name: string){
    super({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        marginTop: 12,
        //cssClasses: ["view_stack"]
    })
    this.app = app
    this.key = key
    console.log("tabbox key:", key)
     //const page_wrapper = this.app.view_stack.addTitled(this, wrapper_title, app._(key))
     //page_wrapper.setIconName(icon_name)

     const lbl = new Gtk.Label({label: "test"})

     let vsp = new Adw.ViewStackPage()
     vsp = this.app.view_stack.addTitled(this, wrapper_title, "...")
      vsp.setIconName(icon_name)
      
     
      
     
       this.app.register_widget(vsp, "title", key);
     
    
     

  }


  async build(list_box: any, items: any[], nav_rows: Record<string, any> ){

     await this.app.get_user_auto_login()

     const isAdmin = this.app.active_user_role === UserRole.admin || this.app.active_user_role === "admin";

     console.log("role isAdmin##", isAdmin, this.app.active_user_role, this.app.role_text, this.app.role_lbl.getText())

     for(const item of items){

    
        // 2. Gate the audit logs row based on clearance status

        if (this.app && item.key === "audit_logs" && !isAdmin) {
            console.log("Hiding audit logs from unauthorized role:", this.app.active_user_role);
            // Skip appending this row entirely by returning early out of the loop iteration
            continue
            
        }
        

        

        const row = new Adw.ActionRow()
        //row.setTitle(item.label ?? item.key)   
        
        this.app.register_widget(row, "title", item.key);
        
        

        row.setActivatable(true)
        const icon_prefix = Gtk.Image.newFromIconName(item.icon)
        row.addPrefix(icon_prefix)
        const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
        row.addSuffix(icon_suffix)
        row.connect("activated", ()=>this.app.on_home_item_clicked(item))

       
         
        
       list_box.append(row)
           
           nav_rows[item.key] = item
        
       
         
      }
      this.append(list_box)
      return nav_rows

  }





}

