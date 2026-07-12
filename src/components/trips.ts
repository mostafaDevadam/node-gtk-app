
import { UserRole } from '../enums.js';
import {Adw, GLib, Gio, Gtk} from '../index.js'


export class TripsComponent {

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
        //const lbl = new Gtk.Label({label: "Trips#"})
        //box.append(lbl)

        // list for both


        // item click -> admin: display form in right_sidebar else display just info

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
          const input_name = new Adw.EntryRow({
            title: "Name",
            inputPurpose: Gtk.InputPurpose.NAME,
            editable: isAdmin
            //marginTop: 20,
          })
          edit_side_group.add(input_name)

          // phone
          const input_phone = new Adw.EntryRow({
            title: "Phone",
            inputPurpose: Gtk.InputPurpose.PHONE,
            editable: isAdmin
            //marginTop: 20,
          })
          edit_side_group.add(input_phone)


          // 
          // submit_btn
          const submit_btn = new Adw.ActionRow({
            title: "save",
            halign: Gtk.Align.CENTER,
            activatable: true,
            visible: isAdmin,
          })
           edit_side_group.add(submit_btn)
           // 
           const view_side_group = new Adw.PreferencesGroup({visible: false})
           sideBox.append(view_side_group)

          const view_row = new Adw.ActionRow() 
          view_side_group.add(view_row)
          view_row.setTitle(`Trip-lorem`)
          view_row.setSubtitle("Lorem lorem lorem")
          const view_row1 = new Adw.ActionRow() 
          view_side_group.add(view_row1)
          view_row1.setTitle(`Trip-lorem 1`)
          view_row1.setSubtitle("Lorem lorem lorem")
          const view_row2 = new Adw.ActionRow() 
          view_side_group.add(view_row2)
          view_row2.setTitle(`Trip-lorem 2`)
          view_row2.setSubtitle("Lorem lorem lorem")
        
         

            
          if(isAdmin){
            const add_btn = new Gtk.Button({label: "Add"})
            box.append(add_btn)
            add_btn.connect("clicked", () => {
                  side_title.setText("Add Trip")
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
            const row = new Adw.ActionRow() 
            row.setTitle(`Trip-${item}`)
            row.setActivatable(true)
            const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
            row.addPrefix(icon_prefix)
            const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
            row.addSuffix(icon_suffix)
            row.connect("activated", ()=>{
               //this.app.clear_right_sidebar()
               if(isAdmin){
                  side_title.setText(`Edit Trip ${item}`)
                  edit_side_group.setVisible(true)
                  view_side_group.setVisible(false)
                  sideBox.setVisible(true)
               }else {
                   side_title.setText(`Trip ${item}`)
                    edit_side_group.setVisible(false)
                    view_side_group.setVisible(true)
                   sideBox.setVisible(true)
               }
               
               

         


            })
            listBox.append(row)

         }





        
       
        this.app.template_view.build_template_view("Trips","home_trips_view", box)

  }

}