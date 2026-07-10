

import {Adw, GLib, Gio, Gtk} from '../index.js'

export class TabBoxComponent extends Gtk.Box {

  app: any
  page_wrapper: any

  constructor(app: any, wrapper_title: string, key: string, icon_name: string){
    super({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        marginTop: 12,
    })
    this.app = app
     const page_wrapper = this.app.view_stack.addTitled(this, wrapper_title, app._(key))
     this.app.register_widget(page_wrapper, "title", key);
     page_wrapper.setIconName(icon_name)

  }


  build(list_box: any, items: any[], nav_rows: any){

     for(const item of items){

        const row = new Adw.ActionRow({
          marginStart: 8,
          marginEnd: 8,
        })
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

