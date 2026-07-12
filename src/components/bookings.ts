
import {Adw, GLib, Gio, Gtk} from '../index.js'


export class BookingsComponent {

   app: any

  constructor(app: any){
     this.app = app
  }

  build_bookings_view(){

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        //const lbl = new Gtk.Label({label: "bookings#"})
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
         const side_group = new Adw.PreferencesGroup()
         sideBox.append(side_group)
         // inputs
         this.build_form(side_group)
         
         const add_btn = new Gtk.Button({
            label: "Add",
            halign: Gtk.Align.END,
         
         })
         box.append(add_btn)
         add_btn.connect("clicked", () => {
            //this.app.clear_right_sidebar()
            side_title.setText("Add Booking")
            sideBox.setVisible(true)

         })
        
         const group = new Adw.PreferencesGroup()
         const listBox = new Gtk.ListBox()
         group.add(listBox)
         box.append(group)

         for(let item of [1,2,3]){
             this.build_card(item, side_title, sideBox, listBox)
         }

        this.app.template_view.build_template_view("Bookings","home_bookngs_view", box)

  }


  build_form(parent: any){

   const input_phone = new Adw.EntryRow({
            title: "Phone",
            inputPurpose: Gtk.InputPurpose.PHONE,
            //marginTop: 20,
          })
          parent.add(input_phone)


          // 
          // submit_btn
          const submit_btn = new Adw.ActionRow({
            title: "save",
            halign: Gtk.Align.CENTER,
            activatable: true,
          })
           parent.add(submit_btn)

  }


  build_card(item: any, side_title: any, sideBox: any, listBox: any){
            const row = new Adw.ActionRow() 
            row.setTitle(`Booking-${item}`)
            row.setActivatable(true)
            const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
            row.addPrefix(icon_prefix)
            const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
            row.addSuffix(icon_suffix)
            row.connect("activated", ()=>{
               side_title.setText(`Edit booking ${item}`)
               sideBox.setVisible(true)
            })
            listBox.append(row)

  }

}