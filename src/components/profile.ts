
import { Adw, GLib, Gio, Gtk } from '../index.js'


import fs from 'fs'
import fs_ from 'fs/promises'
import path from 'path'
import PDF from 'pdfkit'
import { AuditLogService } from '../services/auditlogs.service.js'

export class ProfileComponent {

  app: any
  auditLogService: AuditLogService
  //template_view: TemplateViewComponent


  constructor(app: any) {
    this.app = app
    this.auditLogService = new AuditLogService()
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





    // export_btn
    const export_btn = new Gtk.Button({
      label: "Export"
    })

    const popover = this.displayPopover(export_btn)



    export_btn.on("clicked", async () => {
      console.log("export_btn")

      popover.popup();

      const file_name = 'data_export.pdf'
      const folder_name = "download"
      const folder_path = path.join(process.cwd(), folder_name)

      //const content = 'This file was created by \n clicking the GTK button.';

      const content = `Name: ${this.app.active_user.name}\nEmail: ${this.app.active_user.email}\n`



      /*try {

        if (!fs.existsSync(folder_path)) {
          fs.mkdirSync(folder_path, { recursive: true })
          console.log(`Diectory created: ${folder_path}`)
        }

        const file_path = path.join(folder_path, file_name)

        this.generatePDF(file_path, content)



      } catch (error) {
        console.log("Failed to create file:", error)
      }*/

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


  displayPopover(parent: any) {

    // 1. Create the Popover instance
    const popover = new Gtk.Popover();

    // 2. Create the content you want inside the popover (e.g., a Box with text or buttons)
    const popoverBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 10,
      marginTop: 10,
      marginBottom: 10,
      marginStart: 10,
      marginEnd: 10,
    });

    const label = new Gtk.Label({ label: "Export options or settings" });
    //popoverBox.append(label);

    const group = new Adw.PreferencesGroup({ title: "Export options" })
    popoverBox.append(group);


    const options = ['PDF', 'TXT'];
    const stringList = Gtk.StringList.new(options);

    let selectedFileType = ""

    // 2. Instantiate the ComboRow
    const comboRow = new Adw.ComboRow();
    group.add(comboRow)
    comboRow.setTitle('File Type');
    comboRow.setSubtitle('Select your favorite file');
    comboRow.setModel(stringList); // Map the data model to the Adw row

    // 3. Optional: Enable search filter tracking within the row overlay popup
    comboRow.setEnableSearch(true);

    // 4. Capture selection updates using property notification signatures
    comboRow.on('notify::selected', () => {
      const selectedIndex = comboRow.getSelected();

      // Extract the StringObject wrapper safely
      const selectedItem = comboRow.getSelectedItem()!!

      if (selectedItem) {
        // Assert the generic object as a Gtk.StringObject
        const stringObj = selectedItem as any
        const stringValue = stringObj.getString();

        console.log(`User picked item #${selectedIndex}: "${stringValue}"`);

        selectedFileType = stringValue

      }
    });


    const input_file_name = new Adw.EntryRow({
      title: "File Name",
      inputPurpose: Gtk.InputPurpose.NAME,
    })
    group.add(input_file_name)


    const submit_btn = new Adw.ActionRow({
      title: "Export",
      halign: Gtk.Align.CENTER,
      activatable: true,

    })
    group.add(submit_btn)


    const folder_name = "download"
    const folder_path = path.join(process.cwd(), folder_name)

    //const content = 'This file was created by \n clicking the GTK button.';

    const content = `Name: ${this.app.active_user.name}\nEmail: ${this.app.active_user.email}\n`

    submit_btn.on("activated", () => {
      if (selectedFileType) {
        console.log("submit_btn popover:", selectedFileType)

        const d = new Gtk.FileDialog({
          title: "Export File"
        })



        const dialog = new Gtk.FileChooserNative({
          title: "Export File",
          action: Gtk.FileChooserAction.SAVE,
          transientFor: this.app.window,
          acceptLabel: "_Save",
          cancelLabel: "_Cancel"
        })

        switch (selectedFileType) {
          case "PDF":
            console.log("PDF")
            try {

              if (!fs.existsSync(folder_path)) {
                fs.mkdirSync(folder_path, { recursive: true })
                console.log(`Diectory created: ${folder_path}`)
              }
              //let file_name = `${input_file_name.getText() || 'data_export'}.pdf`


              let file_name = 'data_export.pdf'

              if (input_file_name.getText()) {
                file_name = `${input_file_name.getText()}.pdf`
              }

              const file_path = path.join(folder_path, file_name)

              //this.generatePDF(file_path, content)

              dialog.setTitle("Export PDF")

              dialog.on("response", (responseId) => {
                if (responseId === Gtk.ResponseType.ACCEPT || responseId == 0) {

                  const file_ = dialog.getFile()
                  const filePath_ = file_?.getPath()!!

                  try {
                    this.generatePDF(`${filePath_}.pdf`, content)

                  } catch (error) {
                    this.app.showToast("Cannot export as pdf file!")
                  }

                }
                dialog.destroy()
              })
              dialog.show()

            } catch (error) {
              console.log("Failed to create file:", error)
            }

            break;

          case "TXT":
            console.log("TXT")
            try {

              if (!fs.existsSync(folder_path)) {
                fs.mkdirSync(folder_path, { recursive: true })
                console.log(`Diectory created: ${folder_path}`)
              }

              let file_name = `${input_file_name.getText() || 'data_export'}.txt`

              const file_path = path.join(folder_path, file_name)

              //this.generateTxtFile(file_path, content)

              dialog.setTitle("Export TXT")
              dialog.on("response", (responseId) => {
                console.log({ responseId })
                if (responseId === Gtk.ResponseType.ACCEPT || responseId == 0) {

                  const file_ = dialog.getFile()
                  const filePath_ = file_?.getPath()!!

                  try {
                    this.generateTxtFile(`${filePath_}.txt`, content)

                  } catch (error) {
                    this.app.showToast("Cannot export as txt file!")
                  }

                }
                dialog.destroy()
              })
              dialog.show()

            } catch (error) {
              console.log("Failed to create file:", error)
            }
            break;
        }

        //dialog.show()

      }

      popover.popdown()



    })

    // Set the content container to the popover
    popover.setChild(popoverBox);

    // 3. Set the parent widget (the button that triggers it)

    popover.setParent(parent)


    // Optional: Set positioning (e.g., Gtk.PopoverPosition.BOTTOM)
    popover.setPosition(Gtk.PositionType.BOTTOM);

    return popover

  }


  generatePDF(file_path: any, content: any) {
    const doc = new PDF()

    const writeStream = fs.createWriteStream(file_path)
    doc.pipe(writeStream)

    doc.fontSize(20).text('Data Export Report', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(content);
    //doc.text(`Export Date: ${new Date().toISOString().split('T')[0]}`);
    //doc.text("Status: Success")

    doc.end()

    writeStream.on('finish', () => {
      console.log(`PDF successfully created at: ${file_path}`);
      this.app.showAlert("Notice", "PDF File successfully created in the content folder!")
      this.auditLogService.create({
        state: "profile",
        action_type: "export",
        description: "export user profile",
        user_id: this.app.active_user.id
      })
    })
  }

  generateTxtFile(file_path: any, content: any) {

    console.log({ file_path, content })

    fs.writeFileSync(file_path, content, 'utf-8')
    console.log(`File successfully created at: ${file_path}`)

    this.app.showAlert("Notice", "TXT File successfully created in the content folder!")

    //this.app.showToast("File saved successfully!")

  }
}