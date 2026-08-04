
import { UserRole } from '../enums.js';
import {Adw, GLib, Gio, Gtk} from '../index.js'
import { InputDateTime } from './forms/input-date-time.js';
import { InputDate } from './forms/input-date.js';


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
         this.build_form(edit_side_group, isAdmin)
         
           // 
           const view_side_group = new Adw.PreferencesGroup({visible: false})
           sideBox.append(view_side_group)
           this.build_details(view_side_group)

          
   
            
          if(isAdmin){
            const add_btn = new Gtk.Button({
               label: "Add",
               halign: Gtk.Align.END
            
            })
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
            this.build_card(item, side_title, sideBox, listBox, edit_side_group, view_side_group, isAdmin)

         }
       
        this.app.template_view.build_template_view("Trips","home_trips_view", box)

  }

  build_form(parent: any, isAdmin: boolean){

   /*
   bus_id (FK) 
   departure
   destination
   departure_time
   arrival_time
   status
   available_seats
   */

          // dropdwon-list for buses



         // departure
          const input_departure = new Adw.EntryRow({
            title: "Departure ",
            inputPurpose: Gtk.InputPurpose.NAME,
            //editable: isAdmin
            //marginTop: 20,
          })
          parent.add(input_departure)

          // destination
          const input_destination = new Adw.EntryRow({
            title: "Destination",
            inputPurpose: Gtk.InputPurpose.NAME,
          })
          parent.add(input_destination)

          // departure_time
          /*const input_departure_time = new Adw.EntryRow({
            title: "Departure Time",
            inputPurpose: Gtk.InputPurpose.NUMBER,
            editable: false,
          })
          parent.add(input_departure_time)*/
          //new InputDateTime().build(parent, "Departure Time")
          InputDateTime.build(parent, "Departure Time")

          
         // arrival_time
          /*const input_arrival_time = new Adw.EntryRow({
            title: "Arrival Time",
            inputPurpose: Gtk.InputPurpose.NAME,
          })
          parent.add(input_arrival_time)*/
          //InputDate.build(parent, "Arrival Time")
          InputDateTime.build(parent, "Arrival Time")

         
         // status
          const input_status = new Adw.EntryRow({
            title: "Status",
            inputPurpose: Gtk.InputPurpose.NAME,
          })
          parent.add(input_status)

          // available_seats
          const input_available_seats = new Adw.EntryRow({
            title: "Available Seats",
            inputPurpose: Gtk.InputPurpose.NUMBER,
          })
          parent.add(input_available_seats)


          
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
          view_row.setTitle(`Trip-lorem`)
          view_row.setSubtitle("Lorem lorem lorem")
          const view_row1 = new Adw.ActionRow() 
          parent.add(view_row1)
          view_row1.setTitle(`Trip-lorem 1`)
          view_row1.setSubtitle("Lorem lorem lorem")
          const view_row2 = new Adw.ActionRow() 
          parent.add(view_row2)
          view_row2.setTitle(`Trip-lorem 2`)
          view_row2.setSubtitle("Lorem lorem lorem")

  }

   build_card(item: any, side_title: any, sideBox: any, listBox: any, edit_side_group: any, view_side_group: any, isAdmin: boolean){
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


}