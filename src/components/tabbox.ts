

import {Adw, GLib, Gio, Gtk} from '../index.js'

export class TabBoxComponent extends Gtk.Box {

  app: any
  page_wrapper: any

  constructor(app: any, wrapper_title: string, key: string, icon_name: string){
    super({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        marginTop: 12,
        //cssClasses: ["view_stack"]
    })
    this.app = app
    console.log("tabbox key:", key)
     //const page_wrapper = this.app.view_stack.addTitled(this, wrapper_title, app._(key))
     //page_wrapper.setIconName(icon_name)

     const lbl = new Gtk.Label({label: "test"})

     let vsp = new Adw.ViewStackPage()
     vsp = this.app.view_stack.addTitled(this, wrapper_title, "...")
      vsp.setIconName(icon_name)
      
     
      
     
       this.app.register_widget(vsp, "title", key);
     
    
     

  }


  build(list_box: any, items: any[], nav_rows: any){

     for(const item of items){

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

