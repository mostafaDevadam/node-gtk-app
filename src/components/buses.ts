import { UserRole } from '../enums.js';
import {Adw, GLib, Gio, Gtk} from '../index.js'



export class BusesComponent {

   app: any

  constructor(app: any){
     this.app = app
  }

  build_trips_view(){

     const isAdmin = this.app.active_user_role === UserRole.admin || this.app.active_user_role === "admin";
   

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        //const lbl = new Gtk.Label({label: "Buses#"})
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
         const side_title = new Gtk.Label()
         sideBox.append(side_title)

          //
         const edit_side_group = new Adw.PreferencesGroup({visible: false})
         sideBox.append(edit_side_group)
         // inputs
         // phone
          /*const input_name = new Adw.EntryRow({
            title: "Name",
            inputPurpose: Gtk.InputPurpose.NAME,
            editable: isAdmin
            //marginTop: 20,
          })
          edit_side_group.add(input_name)*/

          this.build_form(edit_side_group, isAdmin)
           // 
           const view_side_group = new Adw.PreferencesGroup({visible: false})
           sideBox.append(view_side_group)

           this.build_details(view_side_group)

         
         if(isAdmin){
            const add_btn = new Gtk.Button({
               label: "Add",
               halign: Gtk.Align.END,
            
            })
            box.append(add_btn)
            add_btn.connect("clicked", () => {
                  side_title.setText("Add Bus")
                  edit_side_group.setVisible(true)
                  sideBox.setVisible(true)
             })
         }
         //
         const group = new Adw.PreferencesGroup()
         const listBox = new Gtk.ListBox()
         group.add(listBox)
         box.append(group)

         for(let item of [1,2,3]){
             this.build_card(item, side_title, sideBox, listBox, edit_side_group, view_side_group, isAdmin)
         }




        
       
        this.app.template_view.build_template_view("Buses","home_buses_view", box)

  }


   build_form(parent: any, isAdmin: boolean){

         // bus_number
          const input_bus_number = new Adw.EntryRow({
            title: "Bus Number",
            inputPurpose: Gtk.InputPurpose.NUMBER,
            editable: isAdmin
            //marginTop: 20,
          })
          parent.add(input_bus_number)
         
         // capacity
          const input_capacity = new Adw.EntryRow({
            title: "Capacity",
            inputPurpose: Gtk.InputPurpose.NUMBER,
            editable: isAdmin
            
          })
          parent.add(input_capacity)
           // bus_type
          const input_bus_type = new Adw.EntryRow({
            title: "Bus Type",
            inputPurpose: Gtk.InputPurpose.NAME,
            editable: isAdmin
            
          })
          parent.add(input_bus_type)
           // capacity
          const input_chair_count = new Adw.EntryRow({
            title: "Chair Count",
            inputPurpose: Gtk.InputPurpose.NUMBER,
            editable: isAdmin
            
          })
          parent.add(input_chair_count)



          // 
          // submit_btn
          const submit_btn = new Adw.ActionRow({
            title: "save",
            halign: Gtk.Align.CENTER,
            activatable: true,
            visible: isAdmin,
          })
           parent.add(submit_btn)

  }

  build_details(parent: any){

          const view_row = new Adw.ActionRow() 
          parent.add(view_row)
          view_row.setTitle(`Bus-lorem`)
          view_row.setSubtitle("Lorem lorem lorem")
          const view_row1 = new Adw.ActionRow() 
          parent.add(view_row1)
          view_row1.setTitle(`Bus-lorem 1`)
          view_row1.setSubtitle("Lorem lorem lorem")
          const view_row2 = new Adw.ActionRow() 
          parent.add(view_row2)
          view_row2.setTitle(`Bus-lorem 2`)
          view_row2.setSubtitle("Lorem lorem lorem")

  }


  build_card(item: any, side_title: any, sideBox: any, listBox: any, edit_side_group: any, view_side_group: any, isAdmin: boolean){
             const row = new Adw.ActionRow() 
            row.setTitle(`Bus-${item}`)
            row.setActivatable(true)
            const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
            row.addPrefix(icon_prefix)
            const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
            row.addSuffix(icon_suffix)
            row.connect("activated", ()=>{
               //this.app.clear_right_sidebar()
               if(isAdmin){
                  side_title.setText(`Edit Bus ${item}`)
                  edit_side_group.setVisible(true)
                  view_side_group.setVisible(false)
                  sideBox.setVisible(true)
               }else {
                   side_title.setText(`Bus ${item}`)
                    edit_side_group.setVisible(false)
                    view_side_group.setVisible(true)
                   sideBox.setVisible(true)
               }
            })
            listBox.append(row)

  }

}
