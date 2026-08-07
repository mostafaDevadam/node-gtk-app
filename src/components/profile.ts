
import { Adw, GLib, Gio, Gtk } from '../index.js'


import fs from 'fs'
import path from 'path'

export class ProfileComponent {

  app: any
  //template_view: TemplateViewComponent
  constructor(app: any) {
    this.app = app
    //this.template_view = new TemplateViewComponent(this.app)
  }

  build_info_view() {

    // in center_stack

    const box = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,


    })
    box.setSizeRequest(240, -1)
    //const lbl = new Gtk.Label({label: "info#"})
    //box.append(lbl)

    // export_btn
    const export_btn = new Gtk.Button({
      label: "Export"
    })

    export_btn.on("clicked", () => {
      console.log("export_btn")

      const file_name = 'data_export.txt'
      const folder_name = "download"
      const folder_path = path.join(process.cwd(), folder_name)
      const file_path = path.join(folder_path, file_name)
      //const content = 'This file was created by \n clicking the GTK button.';

      const content = `${this.app.active_user.name}\n${this.app.active_user.email}\n`



      try {

        if (!fs.existsSync(folder_path)) {
          fs.mkdirSync(folder_path, { recursive: true })
          console.log(`Diectory created: ${folder_path}`)
        }



        fs.writeFileSync(file_path, content, 'utf-8')
        console.log(`File successfully created at: ${file_path}`)

        /*const dialog = new Gtk.MessageDialog({
          text: "",
          messageType: Gtk.MessageType.INFO,
          buttons: Gtk.ButtonsType.OK
        })
        dialog.present()*/

        //this.app.center_stack.append(dialog)

        //dialog.destroy()


        this.app.showAlert("Notice", "File successfully created in the content folder!")



        //this.app.showToast("File saved successfully!")

      } catch (error) {
        console.log("Failed to create file:", error)
      }

    })

    box.append(export_btn)




    // edit_btn

    const edit_btn = new Gtk.Button({
      label: "Edit"


    })

    edit_btn.connect("clicked", () => {


      // in right_side
      const title = new Gtk.Label({
        label: "Edit Profile Info",
        halign: Gtk.Align.CENTER,
        marginTop: 20,

      })
      this.app.right_sidebar.append(title)

      // 
      const group = new Adw.PreferencesGroup({
        marginTop: 20,
        marginStart: 20,
        marginEnd: 20,

      })


      // close_btn
      const close_btn = new Gtk.Button({
        label: "Close",
        halign: Gtk.Align.START
      })
      close_btn.connect("clicked", () => {
        title.setVisible(false)
        close_btn.setVisible(false)
        group.setVisible(false)
      })
      this.app.right_sidebar.append(close_btn)
      //
      this.app.right_sidebar.append(group)
      // inputs
      // name
      const input_name = new Adw.EntryRow({
        title: "Name",
        inputPurpose: Gtk.InputPurpose.NAME,

      })
      group.add(input_name)
      // email
      const input_email = new Adw.EntryRow({
        title: "Email",
        inputPurpose: Gtk.InputPurpose.EMAIL,
        //marginTop: 20,
      })
      group.add(input_email)
      // phone
      const input_phone = new Adw.EntryRow({
        title: "Phone",
        inputPurpose: Gtk.InputPurpose.PHONE,
        //marginTop: 20,
      })
      group.add(input_phone)


      // 
      // submit_btn
      const submit_btn = new Adw.ActionRow({
        title: "save",
        halign: Gtk.Align.CENTER,
        activatable: true,
      })

      /*const submit_btn = new Gtk.Button({ 
        label: "Save",
        halign: Gtk.Align.END,
        marginTop: 40,
      })*/
      submit_btn.connect("activated", () => {
        /*title.setVisible(false)
        close_btn.setVisible(false)
        group.setVisible(false)*/
        this.app.showToast("saved profile info data")
      })
      group.add(submit_btn)





    })

    box.append(edit_btn)











    // in center_stack


    const group = new Adw.PreferencesGroup()
    //group.setTitle("Information")
    this.app.register_widget(group, "title", "information")

    //self.register_widget(group, "title", "setting_general_item")

    //const animation_row = new Adw.SwitchRow()
    //self.register_widget(animation_row, "title", "animations")
    //group.add(animation_row)
    box.append(group)


    const name_row = new Adw.ActionRow({ title: "Name", subtitle: this.app.active_user.name ?? "test-name" })


    if (this.app) {
      this.app.register_widget(name_row, "title", "name")
      name_row.addSuffix(this.app.build_copy_btn(this.app.active_user.name))
    }
    group.add(name_row)

    const email_row = new Adw.ActionRow({ title: "Email", subtitle: this.app.active_user.email ?? "test email" })
    this.app.register_widget(email_row, "title", "email")
    email_row.addSuffix(this.app.build_copy_btn(this.app.active_user.email))
    group.add(email_row)




    //const temp = new TemplateViewComponent(this)
    this.app.template_view.build_template_view("Profile", "profile_info_view", box)

  }

  build_address_view() {

    const box = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,


    })
    box.setSizeRequest(240, -1)
    //const lbl = new Gtk.Label({label: "address#"})
    //box.append(lbl)


    const edit_btn = new Gtk.Button({
      label: "Edit"


    })

    edit_btn.connect("clicked", () => {


      // in right_side
      const title = new Gtk.Label({
        label: "Edit Profile Address",
        halign: Gtk.Align.CENTER,
        marginTop: 20,

      })
      this.app.right_sidebar.append(title)

      // 
      const group = new Adw.PreferencesGroup({
        marginTop: 20,
        marginStart: 20,
        marginEnd: 20,

      })


      // close_btn
      const close_btn = new Gtk.Button({
        label: "Close",
        halign: Gtk.Align.START
      })
      close_btn.connect("clicked", () => {
        title.setVisible(false)
        close_btn.setVisible(false)
        group.setVisible(false)
      })
      this.app.right_sidebar.append(close_btn)
      //
      this.app.right_sidebar.append(group)
      // inputs
      // name
      const input_street = new Adw.EntryRow({
        title: "Street",
        inputPurpose: Gtk.InputPurpose.NAME,

      })
      group.add(input_street)
      // email
      const input_city = new Adw.EntryRow({
        title: "City",
        inputPurpose: Gtk.InputPurpose.EMAIL,
        //marginTop: 20,
      })
      group.add(input_city)



      // 
      // submit_btn
      const submit_btn = new Adw.ActionRow({
        title: "save",
        halign: Gtk.Align.CENTER,
        activatable: true,
      })

      /*const submit_btn = new Gtk.Button({ 
        label: "Save",
        halign: Gtk.Align.END,
        marginTop: 40,
      })*/
      submit_btn.connect("activated", () => {
        /*title.setVisible(false)
        close_btn.setVisible(false)
        group.setVisible(false)*/
        this.app.showToast("saved profile address data")
      })
      group.add(submit_btn)





    })

    box.append(edit_btn)



    const group = new Adw.PreferencesGroup()
    //group.setTitle("Address")
    this.app.register_widget(group, "title", "profile_address")
    box.append(group)

    const street_row = new Adw.ActionRow({ title: "Street", subtitle: "test-street" })
    if (this.app) {
      this.app.register_widget(street_row, "title", "street")
      street_row.addSuffix(this.app.build_copy_btn("schluss"))
    }

    group.add(street_row)

    const city_row = new Adw.ActionRow({ title: "City", subtitle: "test-city" })
    this.app.register_widget(city_row, "title", "city")
    city_row.addSuffix(this.app.build_copy_btn("kiel"))
    group.add(city_row)




    //const temp = new TemplateViewComponent(this)
    this.app.template_view.build_template_view("Profile", "profile_address_view", box)

  }
}