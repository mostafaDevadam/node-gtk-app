
import { UserRole } from '../enums.js';
import {Adw, GLib, Gio, Gtk} from '../index.js'


export class HistoryComponent {

   app: any

  constructor(app: any){
     this.app = app
  }

  build_history_view(){
     const isAdmin = this.app.active_user_role === UserRole.admin || this.app.active_user_role === "admin";
   

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        //const lbl = new Gtk.Label({label: "History#"})
        //box.append(lbl)

        // in right_sidebar
         const sideBox = new Gtk.Box({
               orientation: Gtk.Orientation.VERTICAL, 
               spacing: 10,
               marginBottom: 12,
               marginStart: 12,
               marginEnd: 12,
               visible: false,
         })
         this.app.right_sidebar.append(sideBox)
         const side_title = new Gtk.Label({label: "History"})
         sideBox.append(side_title)
           // 
           const view_side_group = new Adw.PreferencesGroup()
           sideBox.append(view_side_group)
           this.build_details(view_side_group)
         //
         const group = new Adw.PreferencesGroup()
         const listBox = new Gtk.ListBox()
         group.add(listBox)
         box.append(group)

         for(let item of [1,2,3]){
            this.build_card(item, side_title, sideBox, listBox)
         }

        this.app.template_view.build_template_view("History","home_history_view", box)

  }

  build_details(parent: any){

          const view_row = new Adw.ActionRow() 
          parent.add(view_row)
          view_row.setTitle(`History-lorem`)
          view_row.setSubtitle("Lorem lorem lorem")
          const view_row1 = new Adw.ActionRow() 
          parent.add(view_row1)
          view_row1.setTitle(`History-lorem 1`)
          view_row1.setSubtitle("Lorem lorem lorem")
          const view_row2 = new Adw.ActionRow() 
          parent.add(view_row2)
          view_row2.setTitle(`History-lorem 2`)
          view_row2.setSubtitle("Lorem lorem lorem")

  }

  build_card(item: any, side_title: any, sideBox: any, listBox: any){
            const row = new Adw.ActionRow() 
            row.setTitle(`History-${item}`)
            row.setActivatable(true)
            const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
            row.addPrefix(icon_prefix)
            const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
            row.addSuffix(icon_suffix)
            row.connect("activated", ()=>{
               side_title.setText(`History ${item}`)
               sideBox.setVisible(true)
            })
            listBox.append(row)

  }

}