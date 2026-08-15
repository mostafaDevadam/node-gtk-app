
import { Adw, GLib, Gio, Gtk, Gdk, GObject } from '../index.js'


import fs from 'fs'
import fs_ from 'fs/promises'
import path from 'path'
import PDF from 'pdfkit'
import { AuditLogService } from '../services/auditlogs.service.js'
import { UserService } from '../services/user.service.js'
import { USER } from '../types.js'

import * as pdfLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import os from 'os';

export class ProfileComponent {

  app: any
  auditLogService: AuditLogService
  //template_view: TemplateViewComponent
  userService: UserService
  userId: string = ""

  currentUser: USER = {}


  constructor(app: any) {
    this.app = app
    this.auditLogService = new AuditLogService()
    this.userService = new UserService()
    //this.template_view = new TemplateViewComponent(this.app)
  }

  async getUser() {
    this.currentUser = await this.userService.getUserById(this.userId)
    //console.log("currentUser:", this.currentUser)

  }

  async build_info_view() {
    this.userId = this.app.active_user.id
    this.getUser()







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
        text: this.currentUser.name ?? this.app.active_user.name ?? ""

      })
      group.add(input_name)
      // email
      const input_email = new Adw.EntryRow({
        title: "Email",
        inputPurpose: Gtk.InputPurpose.EMAIL,
        //marginTop: 20,
        text: this.currentUser.email ?? this.app.active_user.email ?? ""
      })
      group.add(input_email)
      // phone
      const input_phone = new Adw.EntryRow({
        title: "Phone",
        inputPurpose: Gtk.InputPurpose.PHONE,
        text: this.currentUser.phone ?? this.app.active_user.phone ?? ""
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
      submit_btn.connect("activated", async () => {
        /*title.setVisible(false)
        close_btn.setVisible(false)
        group.setVisible(false)*/

        if (!this.app.active_user.password) {
          console.log("cannot update profile info because missing password")
          return
        }

        const obj: USER = {
          ...this.app.active_user,
          name: input_name.getText() ?? this.app.active_user.name ?? "",
          email: input_email.getText() ?? this.app.active_user.email ?? "",
          phone: input_phone.getText() ?? this.app.active_user.phone ?? "",
          password: this.app.active_user.password,
          created_at: this.app.active_user.created_at ?? ""

        }

        console.log("submit edit profile info:", obj)

        if (!obj.id) {
          this.app.showToast("id is requited!")
          return
        }

        const result = await this.userService.update(obj.id, obj)
        if (!result) {
          this.app.showToast("Updated profile info successfully!")
          return
        }

        this.getUser()

        this.app.showToast("Cannot update profile info!")
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


    const name_row = new Adw.ActionRow({ title: "Name", subtitle: this.currentUser.name ?? this.app.active_user.name ?? "test-name" })


    if (this.app) {
      this.app.register_widget(name_row, "title", "name")
      name_row.addSuffix(this.app.build_copy_btn(this.app.active_user.name))
    }
    group.add(name_row)

    const email_row = new Adw.ActionRow({ title: "Email", subtitle: this.currentUser.email ?? this.app.active_user.email ?? "test email" })
    this.app.register_widget(email_row, "title", "email")
    email_row.addSuffix(this.app.build_copy_btn(this.app.active_user.email))
    group.add(email_row)


    // drag-drop
    //this.buildFlatChooseFile(box)
    // this.buildDragDrop(box)
    //const dd = new DragDropComponent()
    //dd.buildDragDrop(box)

    //box.append(dnd())
    const dnd_instance = new DndComponent(this.app)
    box.append(dnd_instance.dnd())





    //const temp = new TemplateViewComponent(this)
    this.app.template_view.build_template_view("Profile", "profile_info_view", box)

  }

  build_address_view() {

    this.userId = this.app.active_user.id
    this.getUser()

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
      // street
      const input_street = new Adw.EntryRow({
        title: "Street",
        inputPurpose: Gtk.InputPurpose.NAME,
        text: this.currentUser.street ?? this.app.active_user.street ?? ""

      })
      group.add(input_street)
      // city
      const input_city = new Adw.EntryRow({
        title: "City",
        inputPurpose: Gtk.InputPurpose.NAME,
        text: this.currentUser.city ?? this.app.active_user.city ?? ""
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
      submit_btn.connect("activated", async () => {
        /*title.setVisible(false)
        close_btn.setVisible(false)
        group.setVisible(false)*/
        if (!this.app.active_user.password) {
          console.log("cannot update profile info because missing password")
          return
        }

        const obj: USER = {
          ...this.app.active_user,
          name: this.app.active_user.name,
          email: this.app.active_user.email,
          phone: this.app.active_user.phone ?? "",
          password: this.app.active_user.password,
          created_at: this.app.active_user.created_at,

          street: input_street.getText() ?? this.app.active_user.street ?? "",
          city: input_city.getText() ?? this.app.active_user.city ?? "",

        }

        console.log("submit edit profile address:", obj)

        if (!obj.id) {
          this.app.showToast("id is requited!")
          return
        }

        const result = await this.userService.update(obj.id, obj)

        if (!result) {
          this.app.showToast("Cannot update profile address!")
          return
        }

        this.getUser()

        this.app.showToast("updated profile address data successfully!!")
      })
      group.add(submit_btn)





    })

    box.append(edit_btn)



    const group = new Adw.PreferencesGroup()
    //group.setTitle("Address")
    this.app.register_widget(group, "title", "profile_address")
    box.append(group)

    const street_row = new Adw.ActionRow({ title: "Street", subtitle: this.currentUser.street ?? this.app.active_user.street ?? "test-street" })
    if (this.app) {
      this.app.register_widget(street_row, "title", "street")
      street_row.addSuffix(this.app.build_copy_btn("schluss"))
    }

    group.add(street_row)

    const city_row = new Adw.ActionRow({ title: "City", subtitle: this.currentUser.city ?? this.app.active_user.city ?? "test-city" })
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

        /*const d = new Gtk.FileDialog({
          title: "Export File"
        })*/



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
        description: "export user profile as PDF",
        user_id: this.app.active_user.id
      })
    })
  }

  generateTxtFile(file_path: any, content: any) {

    console.log({ file_path, content })

    fs.writeFileSync(file_path, content, 'utf-8')
    console.log(`File successfully created at: ${file_path}`)

    this.auditLogService.create({
      state: "profile",
      action_type: "export",
      description: "export user profile as TXT",
      user_id: this.app.active_user.id
    })

    this.app.showAlert("Notice", "TXT File successfully created in the content folder!")

    //this.app.showToast("File saved successfully!")

  }

  buildFlatChooseFile(parent: any) {
    const drag_drop_box = new Gtk.Box({
      orientation: Gtk.Orientation.HORIZONTAL,
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,
      heightRequest: 100,
    })
    parent.append(drag_drop_box)

    const drag_drop_label = new Gtk.Label({
      label: 'Drag & Drop .txt file here',
      vexpand: true,
      hexpand: true
    })
    drag_drop_box.append(drag_drop_label)



    // Make the box reactive to clicks so users can select a file natively
    const clickGesture = new Gtk.GestureClick();
    clickGesture.connect("released", () => {
      // Open native file chooser dialog
      const dialog = new Gtk.FileChooserDialog({
        title: "Open Text File",
        action: Gtk.FileChooserAction.OPEN,
        // transientFor: parent_window, // optional: pass your main window here if available
      });

      dialog.addButton("Cancel", Gtk.ResponseType.CANCEL);
      dialog.addButton("Open", Gtk.ResponseType.ACCEPT);

      dialog.connect("response", (dlg: any, response: number) => {
        if (response === Gtk.ResponseType.ACCEPT) {
          const file = dialog.getFile();
          const filePath = file ? file.getPath() : null;

          if (filePath && filePath.endsWith(".txt")) {
            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                console.log("Error reading file:", err);
                return;
              }
              console.log("File content:\n", data);
              drag_drop_label.setText("Done!");
            });
          }
        }
        dialog.destroy();
      });

      dialog.show();
    });


    drag_drop_box.addController(clickGesture)
  }






  buildDragDrop(parent: any) {
    // Main container
    const mainBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,
    });
    parent.append(mainBox);

    // Create drop area using a Frame
    const dropFrame = new Gtk.Frame();
    //dropFrame.setShadowType(Gtk.ShadowType.IN);

    const dropBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 5,
      marginStart: 20,
      marginEnd: 20,
      marginTop: 20,
      marginBottom: 20,
      heightRequest: 100,
    });

    const dragLabel = new Gtk.Label({
      label: '📄 Drag & Drop .txt file here\nor click to select',
      justify: Gtk.Justification.CENTER,
      useMarkup: true,
      vexpand: true,
      hexpand: true,
    });

    dropBox.append(dragLabel);
    dropFrame.setChild(dropBox);
    mainBox.append(dropFrame);

    // Text display area
    const scrolledWindow = new Gtk.ScrolledWindow({
      heightRequest: 200,
      vexpand: true,
    });

    const textView = new Gtk.TextView()

    textView.setEditable(false);
    textView.setWrapMode(Gtk.WrapMode.WORD);
    scrolledWindow.setChild(textView);
    mainBox.append(scrolledWindow);

    // Setup drag and drop
    this.setupDragAndDrop(dropFrame, dragLabel, textView);


    // Setup click handler using GestureClick
    const clickGesture = new Gtk.GestureClick();
    clickGesture.connect('pressed', () => {
      this.openFileChooser(dragLabel, textView);
    });
    dropFrame.addController(clickGesture);

    // Apply styles
    this.applyStyles();
  }



  handleDrop(value: any, dragLabel: any, textView: any): boolean {
    try {
      console.log('Handling drop value:', typeof value, value);

      let filePath = null;

      // If value is a string, try to parse as URI
      if (typeof value === 'string') {
        console.log('Value is string:', value);
        const lines = value.split('\n').filter((line: string) => line.trim());
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('file://')) {
            filePath = this.uriToPath(trimmed);
            break;
          }
        }
      }

      // If value is an object with getUris method
      if (!filePath && value && typeof value.getUris === 'function') {
        try {
          const uris = value.getUris();
          console.log('Got URIs from getUris():', uris);
          if (uris && uris.length > 0) {
            filePath = this.uriToPath(uris[0]);
          }
        } catch (e) {
          console.log('getUris() failed:', e);
        }
      }

      // If value is an object with getFiles method (Gdk.FileList)
      if (!filePath && value && typeof value.getFiles === 'function') {
        try {
          const files = value.getFiles();
          console.log('Got files from getFiles():', files);
          if (files && files.length > 0) {
            const file = files[0];
            if (file && typeof file.getPath === 'function') {
              filePath = file.getPath();
            }
          }
        } catch (e) {
          console.log('getFiles() failed:', e);
        }
      }

      // Try to get path from Gio.File object directly
      if (!filePath && value && typeof value.getPath === 'function') {
        try {
          filePath = value.getPath();
          console.log('Got path from getPath():', filePath);
        } catch (e) {
          console.log('getPath() failed:', e);
        }
      }

      if (!filePath) {
        dragLabel.setLabel('❌ Could not extract file path from drop data');
        console.log('No file path found');
        return false;
      }

      console.log('File path extracted:', filePath);

      // Check if it's a text file
      if (!filePath.toLowerCase().match(/\.(txt|text|log|md|csv|json|xml|yaml|yml|js|ts|py|java|c|cpp|h|hpp|sh|bash)$/)) {
        dragLabel.setLabel('⚠️ Please drop a text file');
        return false;
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        dragLabel.setLabel(`❌ File not found: ${path.basename(filePath)}`);
        return false;
      }

      // Read the file
      const content = fs.readFileSync(filePath, 'utf8');
      const buffer = textView.getBuffer();
      buffer.setText(content);
      dragLabel.setLabel(`✅ Loaded: ${path.basename(filePath)} (${content.length} characters)`);

      return true;

    } catch (error: any) {
      console.error('Drop error:', error);
      dragLabel.setLabel(`❌ Error: ${error.message}`);
      return false;
    }
  }



  setupDragAndDrop(frame: any, label: any, textView: any) {
    console.log("setupDragAndDrop")
    // Get the GType for Gdk.FileList
    // GTK 4: Create a DropTarget
    const dropTarget = new Gtk.DropTarget()

    dropTarget.setActions(Gdk.DragAction.COPY)

    // Connect the drop signal
    dropTarget.connect('drop', (target: any, value: any, x: number, y: number) => {
      console.log("Drop event triggered, value type:", typeof value, "value:", value)
      return this.handleDropData(value, label, textView);
    });

    // Add visual feedback
    dropTarget.connect('enter', (target: any, x: number, y: number) => {
      console.log("Drag enter")
      frame.getStyleContext().addClass('drag-over')
      return Gdk.DragAction.COPY
    });

    dropTarget.connect('leave', () => {
      console.log("Drag leave")
      frame.getStyleContext().removeClass('drag-over')
    });

    // Add the drop target to the frame
    frame.addController(dropTarget)

    console.log("DropTarget setup complete")


  }


  handleDropData(value: any, label: any, textView: any) {

    console.log("handleDropData called with value type:", typeof value)

    try {
      let filePath = null

      // Method 1: Check if value is a string (URI list)
      if (typeof value === 'string') {
        console.log("Value is string:", value)
        const lines = value.split('\n').filter((line: string) => line.trim())
        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('file://')) {
            filePath = this.uriToPath(trimmed)
            break
          } else if (trimmed.startsWith('/') || trimmed.match(/^[A-Za-z]:/)) {
            // Direct file path (Unix or Windows)
            filePath = trimmed
            break
          }
        }
      }

      // Method 2: Check if value has getUris method
      if (!filePath && value && typeof value.getUris === 'function') {
        try {
          const uris = value.getUris()
          console.log("Got URIs from getUris():", uris)
          if (uris && uris.length > 0) {
            filePath = this.uriToPath(uris[0])
          }
        } catch (e) {
          console.log("getUris() failed:", e)
        }
      }

      // Method 3: Check if value has getText method
      if (!filePath && value && typeof value.getText === 'function') {
        try {
          const text = value.getText()
          console.log("Got text from getText():", text)
          if (text) {
            const lines = text.split('\n').filter((line: string) => line.trim())
            for (const line of lines) {
              const trimmed = line.trim()
              if (trimmed.startsWith('file://')) {
                filePath = this.uriToPath(trimmed)
                break
              } else if (trimmed.startsWith('/') || trimmed.match(/^[A-Za-z]:/)) {
                filePath = trimmed
                break
              }
            }
          }
        } catch (e) {
          console.log("getText() failed:", e)
        }
      }

      // Method 4: Check if value has getPath method (Gio.File)
      if (!filePath && value && typeof value.getPath === 'function') {
        try {
          filePath = value.getPath()
          console.log("Got path from getPath():", filePath)
        } catch (e) {
          console.log("getPath() failed:", e)
        }
      }

      // Method 5: Check if value has getFiles method (Gdk.FileList)
      if (!filePath && value && typeof value.getFiles === 'function') {
        try {
          const files = value.getFiles()
          console.log("Got files from getFiles():", files)
          if (files && files.length > 0) {
            const file = files[0]
            if (file && typeof file.getPath === 'function') {
              filePath = file.getPath()
            }
          }
        } catch (e) {
          console.log("getFiles() failed:", e)
        }
      }

      // Method 6: Check if value is an array
      if (!filePath && Array.isArray(value)) {
        console.log("Value is array:", value)
        for (const item of value) {
          if (typeof item === 'string') {
            if (item.startsWith('file://')) {
              filePath = this.uriToPath(item)
              break
            } else if (item.startsWith('/') || item.match(/^[A-Za-z]:/)) {
              filePath = item
              break
            }
          }
        }
      }

      if (!filePath) {
        label.setLabel('❌ Could not extract file path from drop data')
        console.log("No file path found after all methods")
        return false
      }

      console.log("Final file path:", filePath)
      return this.loadFile(filePath, label, textView)

    } catch (error: any) {
      console.error('Drop error:', error)
      label.setLabel(`❌ Error: ${error.message}`)
      return false
    }


  }


  loadFile(filePath: string, label: any, textView: any): boolean {
    console.log("Loading file:", filePath)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      label.setLabel(`❌ File not found: ${path.basename(filePath)}`)
      return false
    }

    // Check if it's a text file
    if (!filePath.toLowerCase().match(/\.(txt|text|log|md|csv|json|xml|yaml|yml|js|ts|py|java|c|cpp|h|hpp|sh|bash)$/)) {
      label.setLabel('⚠️ Please drop a text file')
      return false
    }

    try {
      // Read the file
      const content = fs.readFileSync(filePath, 'utf8')
      const buffer = textView.getBuffer()
      buffer.setText(content)
      label.setLabel(`✅ Loaded: ${path.basename(filePath)} (${content.length} characters)`)
      return true
    } catch (error: any) {
      label.setLabel(`❌ Error reading file: ${error.message}`)
      return false
    }
  }

  uriToPath(uri: string): string {
    let filePath = uri;

    // Remove file:// prefix
    if (uri.startsWith('file://')) {
      filePath = decodeURI(uri.replace(/^file:\/\//, ''));
    }

    // Handle Windows paths
    if (process.platform === 'win32') {
      filePath = filePath.replace(/^\//, '').replace(/\//g, '\\');
    }

    return filePath;
  }

  openFileChooser(label: any, textView: any) {
    const dialog = new Gtk.FileChooserDialog({
      title: 'Select Text File',
      action: Gtk.FileChooserAction.OPEN,
    });



    dialog.addButton('Cancel', Gtk.ResponseType.CANCEL);
    dialog.addButton('Open', Gtk.ResponseType.OK);

    // Add file filters
    const filter = Gtk.FileFilter.new();
    filter.addPattern('*.txt');
    filter.addPattern('*.text');
    filter.addPattern('*.log');
    filter.addPattern('*.md');
    filter.addPattern('*.csv');
    filter.addPattern('*.json');
    filter.addPattern('*.xml');
    filter.addPattern('*.yaml');
    filter.addPattern('*.yml');
    filter.setName('Text Files');
    dialog.addFilter(filter);

    dialog.connect('response', (responseId: number) => {
      console.log("dropped dialog:", responseId)
      if (responseId === Gtk.ResponseType.OK || responseId == 0) {

        const file = dialog.getFile()

        if (file) {
          const filePath = file?.getPath();
          if (filePath) {
            try {
              const content = fs.readFileSync(filePath, { encoding: 'utf8' });
              const buffer = textView.getBuffer();
              buffer.setText(content, content.length);
              label.setLabel(`✅ Loaded: ${path.basename(filePath)} (${content.length} characters)`);

              console.log(`✅ Loaded: ${path.basename(filePath)} (${content.length} characters)`)
              console.log("dropped file:", filePath)


            } catch (error: any) {
              console.log("error:", error.message)
              label.setLabel(`❌ Error: ${error.message}`);
            }
          }
        }
      }
      dialog.close()
    });

    dialog.show();
  }

  applyStyles() {
    const cssProvider = new Gtk.CssProvider();
    const cssData = `
      frame {
        background-color: #f5f5f5;
        border: 2px dashed #bbb;
        border-radius: 10px;
        padding: 10px;
        transition: all 0.3s ease;
      }
      frame.drag-over {
        background-color: #e3f2fd;
        border-color: #1976d2;
        border-style: solid;
      }
      frame:hover {
        background-color: #eeeeee;
        border-color: #999;
      }
    `;

    cssProvider.loadFromString(cssData);

    const display = Gdk.Display.getDefault();
    if (display) {
      Gtk.StyleContext.addProviderForDisplay(
        display,
        cssProvider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
      );
      console.log('CSS styles loaded successfully');
    } else {
      console.warn('No display found, CSS styles not applied');
    }
  }






}



// dnd: ->dnd_target, openFileChooser->loadFile

const dnd = () => {
  // ---------- The drop zone (a styled Gtk.Box) ----------
  const dropzone = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 12,
    hexpand: true,
    vexpand: true,
  });
  dropzone.addCssClass('card');
  dropzone.addCssClass('dropzone');
  dropzone.setMarginTop(24);
  dropzone.setMarginBottom(24);
  dropzone.setMarginStart(24);
  dropzone.setMarginEnd(24);

  const icon = new Gtk.Image({ iconName: 'document-open-symbolic', pixelSize: 64 });
  const heading = new Gtk.Label({ label: 'Drag a file.txt here' });
  heading.addCssClass('heading');
  const statusLabel = new Gtk.Label({
    label: 'Waiting for a drop\u2026',
    marginStart: 50,


  });
  statusLabel.addCssClass('status');
  statusLabel.setUseMarkup(true);
  const contentLabel = new Gtk.Label({
    label: '',
    wrap: true,
    maxWidthChars: 70,
    halign: Gtk.Align.START,
    marginStart: 15,

  });

  dropzone.append(icon);
  dropzone.append(heading);
  dropzone.append(statusLabel);
  dropzone.append(contentLabel);

  // ---------- CSS styling (visual feedback while dragging) ----------
  const css = new Gtk.CssProvider();
  css.loadFromString(`
    .dropzone {
      border: 2px dashed alpha(@accent_color, 0.7);
      background-color: @card_bg_color;
    }
    .dropzone.hover {
      background-color: alpha(@accent_color, 0.15);
      border-color: @accent_color;
    }
    .heading { font-size: 1.25em; font-weight: 600; }
    .status  { font-size: 0.9em; color: alpha(@window_fg_color, 0.7); }
  `);




  const display = Gdk.Display.getDefault();

  if (display) {
    Gtk.StyleContext.addProviderForDisplay(
      display,
      css,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    );
    console.log('CSS styles loaded successfully');
  } else {
    console.warn('No display found, CSS styles not applied');
  }

  // ---------- Drop target ----------
  // Accept Gio.File (a file dragged from the desktop or a file manager).

  dnd_target(dropzone, heading, statusLabel, contentLabel)

  const textView = new Gtk.TextView();
  textView.setEditable(false);
  textView.setWrapMode(Gtk.WrapMode.WORD);
  textView.setMarginStart(15)


  // Setup click handler
  const clickGesture = new Gtk.GestureClick();
  clickGesture.connect('pressed', () => {
    openFileChooser(statusLabel, textView);
  });
  dropzone.addController(clickGesture);

  //dropzone.append(statusLabel);
  dropzone.append(textView);





  return dropzone
}

const dnd_target = (dropzone: any, heading: any, statusLabel: any, contentLabel: any) => {

  const GFILE_TYPE = GObject.typeFromName('GFile');

  const dropTarget = Gtk.DropTarget.new(
    GFILE_TYPE,
    Gdk.DragAction.COPY
  );

  // Highlight the box while a draggable item hovers over it.
  dropTarget.on('enter', () => {
    dropzone.addCssClass('hover');
    heading.setLabel('Drop it!');
    return Gdk.DragAction.COPY;
  });

  dropTarget.on('leave', () => {
    dropzone.removeCssClass('hover');
    heading.setLabel('Drag a file.txt here');
  });

  // ---------- The drop handler ----------
  dropTarget.on('drop', (value) => {
    dropzone.removeCssClass('hover');
    heading.setLabel('File received');

    const file = value.getObject() as any;

    const uri = file?.getUri();
    const localPath = file?.getPath();
    const basename = file?.getBasename();

    statusLabel.setMarkup(
      '<b>Name:</b> ' +
      GLib.markupEscapeText(basename || '', -1) +
      '\n <b>Path:</b> ' +
      GLib.markupEscapeText(localPath || uri || '', -1)
    );

    // Read the file content
    let text = '';

    try {
      if (localPath) {
        text = fs.readFileSync(localPath, 'utf8');
      } else {
        const [ok, contents] = file.loadContents(null);

        if (ok) {
          text = new TextDecoder('utf-8').decode(contents);
        }
      }
    } catch (e) {
      text = `Could not read file: ${e}`;
    }

    const preview = text.length > 800
      ? text.slice(0, 800) + '\n… (truncated)'
      : text;

    contentLabel.setLabel(preview);

    return true;
  });

  dropzone.addController(dropTarget);

}

const openFileChooser = (dragLabel: any, textView: any) => {
  const dialog = new Gtk.FileChooserDialog({
    title: 'Select Text File',
    action: Gtk.FileChooserAction.OPEN,
  });

  dialog.addButton('Cancel', Gtk.ResponseType.CANCEL);
  dialog.addButton('Open', Gtk.ResponseType.OK);

  const filter = Gtk.FileFilter.new();
  filter.addPattern('*.txt');
  filter.addPattern('*.text');
  filter.addPattern('*.log');
  filter.addPattern('*.md');
  filter.addPattern('*.csv');
  filter.addPattern('*.json');
  filter.addPattern('*.xml');
  filter.addPattern('*.yaml');
  filter.addPattern('*.yml');
  filter.setName('Text Files');
  dialog.addFilter(filter);

  dialog.connect('response', (responseId: number) => {
    if (responseId === Gtk.ResponseType.OK || responseId == 0) {
      const file = dialog.getFile();
      if (file) {
        const filePath = file.getPath();
        if (filePath) {
          loadFile(filePath, dragLabel, textView);
        }
      }
    }
    dialog.close();
  });

  dialog.show();
}

const loadFile = (filePath: string, dragLabel: any, textView: any): boolean => {
  console.log('Loading file:', filePath);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    dragLabel.setLabel(`❌ File not found: ${path.basename(filePath)}`);
    return false;
  }

  // Check if it's a text file
  if (!filePath.toLowerCase().match(/\.(txt|text|log|md|csv|json|xml|yaml|yml|js|ts|py|java|c|cpp|h|hpp|sh|bash)$/)) {
    dragLabel.setLabel('⚠️ Please drop a text file');
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const buffer = textView.getBuffer();
    buffer.setText(content, content.length);
    dragLabel.setLabel(`✅ Loaded: ${path.basename(filePath)} (${content.length} characters)`);
    return true;
  } catch (error: any) {
    dragLabel.setLabel(`❌ Error reading file: ${error.message}`);
    return false;
  }
}

class DndComponent {

  preview_btn: any
  filePath: string = ""
  pdfContent: string = ""
  app: any

  constructor(app: any) {
    this.app = app

  }

  main = () => {
  }


  dnd = () => {
    // ---------- The drop zone (a styled Gtk.Box) ----------
    const container = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 12,
      hexpand: true,
      vexpand: true,
    });
    const dropzone = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 12,
      hexpand: true,
      vexpand: true,
    });
    container.append(dropzone)
    dropzone.addCssClass('card');
    dropzone.addCssClass('dropzone');
    dropzone.setMarginTop(24);
    dropzone.setMarginBottom(24);
    dropzone.setMarginStart(24);
    dropzone.setMarginEnd(24);

    const icon = new Gtk.Image({ iconName: 'document-open-symbolic', pixelSize: 64 });
    const heading = new Gtk.Label({ label: 'Drag a file.txt here' });
    heading.addCssClass('heading');
    const statusLabel = new Gtk.Label({
      label: 'Waiting for a drop\u2026',
      marginStart: 50,


    });
    statusLabel.addCssClass('status');
    statusLabel.setUseMarkup(true);
    const contentLabel = new Gtk.Label({
      label: '',
      wrap: true,
      maxWidthChars: 70,
      halign: Gtk.Align.START,
      marginStart: 15,

    });

    dropzone.append(icon);
    dropzone.append(heading);
    dropzone.append(statusLabel);
    dropzone.append(contentLabel);

    // ---------- CSS styling (visual feedback while dragging) ----------
    const css = new Gtk.CssProvider();
    css.loadFromString(`
      .dropzone {
        border: 2px dashed alpha(@accent_color, 0.7);
        background-color: @card_bg_color;
      }
      .dropzone.hover {
        background-color: alpha(@accent_color, 0.15);
        border-color: @accent_color;
      }
      .heading { font-size: 1.25em; font-weight: 600; }
      .status  { font-size: 0.9em; color: alpha(@window_fg_color, 0.7); }
      .pl: {padding-left: 20px; }
    `);




    const display = Gdk.Display.getDefault();

    if (display) {
      Gtk.StyleContext.addProviderForDisplay(
        display,
        css,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
      );
      console.log('CSS styles loaded successfully');
    } else {
      console.warn('No display found, CSS styles not applied');
    }

    // ---------- Drop target ----------
    // Accept Gio.File (a file dragged from the desktop or a file manager).



    const textView = new Gtk.TextView();
    textView.setEditable(false);
    textView.setWrapMode(Gtk.WrapMode.WORD);
    textView.setMarginStart(15)

    this.dnd_target(container, dropzone, heading, statusLabel, contentLabel, textView)


    // Setup click handler
    const clickGesture = new Gtk.GestureClick();
    clickGesture.connect('pressed', () => {
      this.openFileChooser(statusLabel, textView);
    });
    dropzone.addController(clickGesture);

    //dropzone.append(statusLabel);
    dropzone.append(textView);

    this.preview_btn = new Gtk.Button({ label: "Preview", visible: false })
    container.append(this.preview_btn)

    this.preview_btn.connect("clicked", () => {
      if (this.filePath && this.pdfContent) {
        //this.app.showAlert("Preview", this.pdfContent)
        //this.app.showPdfViewerWindow(this.filePath)
        this.showPdfTextWindow(this.filePath, this.app.window)
      }
    })




    //return dropzone
    return container
  }

  dnd_target = (container: any, dropzone: any, heading: any, statusLabel: any, contentLabel: any, textView: any) => {

    const GFILE_TYPE = GObject.typeFromName('GFile');

    const dropTarget = Gtk.DropTarget.new(
      GFILE_TYPE,
      Gdk.DragAction.COPY
    );

    // Highlight the box while a draggable item hovers over it.
    dropTarget.on('enter', () => {
      dropzone.addCssClass('hover');
      heading.setLabel('Drop it!');
      return Gdk.DragAction.COPY;
    });

    dropTarget.on('leave', () => {
      dropzone.removeCssClass('hover');
      heading.setLabel('Drag a file.txt here');
    });

    // ---------- The drop handler ----------
    dropTarget.on('drop', (value) => {
      dropzone.removeCssClass('hover');
      heading.setLabel('File received');

      const file = value.getObject() as any;

      const uri = file?.getUri();
      const localPath = file?.getPath();
      const basename = file?.getBasename();

      /*if (basename.endsWith(".txt")) {

        statusLabel.setMarkup(
          '<b>Name:</b> ' +
          GLib.markupEscapeText(basename || '', -1) +
          '\n <b>Path:</b> ' +
          GLib.markupEscapeText(localPath || uri || '', -1)
        );

        // Read the file content
        let text = '';

        try {
          if (localPath) {
            text = fs.readFileSync(localPath, { encoding: 'utf8' });
          } else {
            const [ok, contents] = file.loadContents(null);

            if (ok) {
              text = new TextDecoder('utf-8').decode(contents);
            }
          }
        } catch (e) {
          text = `Could not read file: ${e}`;
        }

        const preview = text.length > 800
          ? text.slice(0, 800) + '\n… (truncated)'
          : text;

        contentLabel.setLabel(preview);

      } else if (basename.endsWith(".pdf")) {

        statusLabel.setMarkup(
          '<b>Name:</b> ' +
          GLib.markupEscapeText(basename || '', -1) +
          '\n <b>Path:</b> ' +
          GLib.markupEscapeText(localPath || uri || '', -1)
        );
      }*/


      this.filePath = localPath
      this.loadFile(localPath, statusLabel, textView)





      return true;
    });

    dropzone.addController(dropTarget);

  }

  openFileChooser = (dragLabel: any, textView: any) => {
    const dialog = new Gtk.FileChooserDialog({
      title: 'Select Text File',
      action: Gtk.FileChooserAction.OPEN,
    });

    dialog.addButton('Cancel', Gtk.ResponseType.CANCEL);
    dialog.addButton('Open', Gtk.ResponseType.OK);

    const filter = Gtk.FileFilter.new();
    filter.addPattern('*.txt');
    filter.addPattern('*.text');
    filter.addPattern('*.log');
    filter.addPattern('*.md');
    filter.addPattern('*.csv');
    filter.addPattern('*.json');
    filter.addPattern('*.xml');
    filter.addPattern('*.yaml');
    filter.addPattern('*.yml');
    filter.setName('Text Files');
    dialog.addFilter(filter);

    dialog.connect('response', (responseId: number) => {
      if (responseId === Gtk.ResponseType.OK || responseId == 0) {
        const file = dialog.getFile();
        if (file) {
          const filePath = file.getPath();
          if (filePath) {
            this.loadFile(filePath, dragLabel, textView);
          }
        }
      }
      dialog.close();
    });

    dialog.show();
  }

  loadFile = async (filePath: string, dragLabel: any, textView: any): Promise<boolean> => {
    console.log('Loading file:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      dragLabel.setLabel(`❌ File not found: ${path.basename(filePath)}`);
      return false;
    }

    // Check if it's a text file
    if (!filePath.toLowerCase().match(/\.(txt|pdf|text|log|md|csv|json|xml|yaml|yml|js|ts|py|java|c|cpp|h|hpp|sh|bash)$/)) {
      dragLabel.setLabel('⚠️ Please drop a text or pdf file');
      return false;
    }

    if (filePath.toLowerCase().endsWith(".pdf")) {

      dragLabel.setLabel(`✅ Loaded: ${path.basename(filePath)} and cannot display content of pdf`);
      try {
        //const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        //const buffer = textView.getBuffer();
        //console.log("pdf content:", content)




        const buffer = textView.getBuffer();
        const content = await this.getPdfContent(filePath)
        //console.log("content:", content)
        buffer.setText(content, content.length);
        this.pdfContent = content

        dragLabel.setLabel(`✅ Loaded: ${path.basename(filePath)} (${content.length} characters)`);

        this.preview_btn.setVisible(true)

        return true;

      } catch (error) {
        return false

      }

    }

    try {
      this.preview_btn.setVisible(false)
      const content = fs.readFileSync(filePath, { encoding: 'utf8' });
      const buffer = textView.getBuffer();
      buffer.setText(content, content.length);
      dragLabel.setLabel(`✅ Loaded: ${path.basename(filePath)} (${content.length} characters)`);
      return true;
    } catch (error: any) {
      dragLabel.setLabel(`❌ Error reading file: ${error.message}`);
      return false;
    }
  }



  getPdfContent = async (filePath: string): Promise<string> => {

    try {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const loadingTask = pdfLib.getDocument({ data });
      const pdfDocument = await loadingTask.promise;

      let fullText = "";
      let formattedOutput = "";

      // Loop through all pages to extract text content
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();

        // Concatenate text items for this page
        //const pageText = textContent.items.map((item: any) => item.str).join(" ");
        //fullText += `--- Page ${i} ---\n${pageText}\n\n`;

        // Print header on a new line
        formattedOutput += `\n=== PAGE ${i} ===\n`;

        // Map each text item to its own line
        const pageLines = textContent.items.map((item: any) => item.str);
        formattedOutput += pageLines.join("\n") + "\n";
      }

      console.log("Extracted PDF Text:\n", fullText);

      // Display the text inside your label or a text buffer
      // (Truncate display string if it's too long for a single label)
      //label.setText(fullText.length > 200 ? fullText.substring(0, 200) + "..." : fullText);
      //return fullText.length > 300 ? fullText.substring(0, 300) + "..." : fullText
      return formattedOutput.length > 300 ? formattedOutput.substring(0, 300) + "..." : formattedOutput

    } catch (error) {
      console.error("Error reading PDF text:", error);
      //label.setText("Failed to read PDF text");
      return "Failed to read PDF text"
    }

  }




  async showPdfTextWindow(pdfPath: string, parentWindow: any) {
    try {
      const data = new Uint8Array(fs.readFileSync(pdfPath));

      // Pass basic parameters to avoid standard font lookup crashes in Node
      const loadingTask = pdfLib.getDocument({
        data,
        useSystemFonts: true
      });

      /*const pdfDocument = await loadingTask.promise;
      let formattedOutput = "";
  
      // Loop through all pages and compile clean, line-by-line text
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        
        formattedOutput += `\n=== PAGE ${i} ===\n`;
        const pageLines = textContent.items.map((item: any) => item.str);
        formattedOutput += pageLines.join("\n") + "\n";
      }*/

      // 1. Create GTK Window Viewer
      const window = new Gtk.Window({
        title: `PDF Reader - ${path.basename(pdfPath)}`,
        modal: true,
        transientFor: parentWindow,
        defaultWidth: 650,
        defaultHeight: 750,
      });

      // 2. Scrolled Container for multi-page support
      const scrolledWindow = new Gtk.ScrolledWindow({
        vexpand: true,
        hexpand: true,
        marginTop: 10, marginBottom: 10, marginStart: 10, marginEnd: 10,
      });

      // 3. Multi-line Text View Buffer
      const textView = new Gtk.TextView({
        editable: false,
        cursorVisible: false,
        wrapMode: Gtk.WrapMode.WORD,
        vexpand: true,
        hexpand: true, 
        cssClasses: ['card', 'pl']
        
      });

      const textBuffer = textView.getBuffer();
      textBuffer.setText(this.pdfContent, this.pdfContent.length);

      // 2. Create Layout Container
      const mainBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        marginTop: 10,
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10,
      });


      // 3. Control Toolbar Box (Top)
      const toolbarBox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 6,
      });
      mainBox.append(toolbarBox);



      mainBox.append(textView)


      const prevButton = new Gtk.Button({ label: "◄ Prev" });
      const nextButton = new Gtk.Button({ label: "Next ►" });
      const pageLabel = new Gtk.Label({ label: `Page 1 of ${0}` });

      const zoomInButton = new Gtk.Button({ label: "Zoom +" });
      const zoomOutButton = new Gtk.Button({ label: "Zoom -" });

      toolbarBox.append(prevButton);
      toolbarBox.append(nextButton);
      toolbarBox.append(pageLabel);
      toolbarBox.append(zoomInButton);
      toolbarBox.append(zoomOutButton);



      scrolledWindow.setChild(mainBox);
      window.setChild(scrolledWindow);

      // 4. Open the viewer window
      window.present();

    } catch (error) {
      console.error("Error reading PDF text content:", error);
    }
  }

}


class DragDropComponent {
  private dragLabel: any = null;
  private textView: any = null;

  buildDragDrop(parent: any) {
    // Main container
    const mainBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,
    });
    parent.append(mainBox);

    // Create drop area - use Frame
    const dropFrame = new Gtk.Frame();
    //dropFrame.setShadowType(Gtk.ShadowType.IN);

    const dropBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 5,
      marginStart: 20,
      marginEnd: 20,
      marginTop: 20,
      marginBottom: 20,
      heightRequest: 100,
    });

    this.dragLabel = new Gtk.Label({
      label: '📄 Drag & Drop .txt file here\nor click to select',
      justify: Gtk.Justification.CENTER,
      useMarkup: true,
      vexpand: true,
      hexpand: true,
    });

    dropBox.append(this.dragLabel);
    dropFrame.setChild(dropBox);
    mainBox.append(dropFrame);

    // Text display area
    const scrolledWindow = new Gtk.ScrolledWindow({
      heightRequest: 200,
      vexpand: true,
    });

    this.textView = new Gtk.TextView();
    this.textView.setEditable(false);
    this.textView.setWrapMode(Gtk.WrapMode.WORD);
    scrolledWindow.setChild(this.textView);
    mainBox.append(scrolledWindow);

    // Setup drag and drop
    console.log("---------------#")
    //this.setupDragAndDrop(dropBox);
    //dropFrame.addController(this.setupDragAndDrop(dropBox));

    //dropBox.append(dnd())

    // Setup click handler
    const clickGesture = new Gtk.GestureClick();
    clickGesture.connect('pressed', () => {
      this.openFileChooser();
    });
    dropFrame.addController(clickGesture);

    // Apply styles
    this.applyStyles();
  }

  setupDragAndDrop(widget: any) {
    console.log('Setting up drag and drop with DropTarget...');


    const GFILE_TYPE = GObject.typeFromName('GFile');

    const dropTarget = Gtk.DropTarget.new(
      GFILE_TYPE,
      Gdk.DragAction.COPY
    );

    // Highlight the box while a draggable item hovers over it.
    dropTarget.on('enter', () => {
      widget.addCssClass('hover');
      return Gdk.DragAction.COPY;
    });

    dropTarget.on('leave', () => {
      widget.removeCssClass('hover');

    });

    // ---------- The drop handler ----------
    dropTarget.on('drop', (value) => {
      widget.removeCssClass('hover');


      const file = value.getObject() as any;

      const uri = file?.getUri();
      const localPath = file?.getPath();
      const basename = file?.getBasename();



      // Read the file content
      let text = '';

      try {
        if (localPath) {
          text = fs.readFileSync(localPath, 'utf8');
        } else {
          const [ok, contents] = file.loadContents(null);

          if (ok) {
            text = new TextDecoder('utf-8').decode(contents);
          }
        }
      } catch (e) {
        text = `Could not read file: ${e}`;
      }

      const preview = text.length > 800
        ? text.slice(0, 800) + '\n… (truncated)'
        : text;



      return true;
    });


    // Add the drop target to the widget
    //widget.addController(dropTarget);
    console.log('DropTarget setup complete');
    return dropTarget
  }

  handleDrop(value: any): boolean {
    console.log('Handling drop value:', typeof value);


    return true
  }

  loadFile(filePath: string): boolean {
    console.log('Loading file:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      this.dragLabel.setLabel(`❌ File not found: ${path.basename(filePath)}`);
      return false;
    }

    // Check if it's a text file


    try {
      const content = fs.readFileSync(filePath, { encoding: 'utf8' });
      const buffer = this.textView.getBuffer();
      buffer.setText(content, content.length);
      this.dragLabel.setLabel(`✅ Loaded: ${path.basename(filePath)} (${content.length} characters)`);
      return true;
    } catch (error: any) {
      this.dragLabel.setLabel(`❌ Error reading file: ${error.message}`);
      return false;
    }
  }



  uriToPath(uri: string): string {
    let filePath = uri;
    if (uri.startsWith('file://')) {
      filePath = decodeURI(uri.replace(/^file:\/\//, ''));
    }
    if (process.platform === 'win32') {
      filePath = filePath.replace(/^\//, '').replace(/\//g, '\\');
    }
    return filePath;
  }

  openFileChooser() {
    const dialog = new Gtk.FileChooserDialog({
      title: 'Select Text File',
      action: Gtk.FileChooserAction.OPEN,
    });

    dialog.addButton('Cancel', Gtk.ResponseType.CANCEL);
    dialog.addButton('Open', Gtk.ResponseType.OK);

    const filter = Gtk.FileFilter.new();
    filter.addPattern('*.txt');
    filter.addPattern('*.text');
    filter.addPattern('*.log');
    filter.addPattern('*.md');
    filter.addPattern('*.csv');
    filter.addPattern('*.json');
    filter.addPattern('*.xml');
    filter.addPattern('*.yaml');
    filter.addPattern('*.yml');
    filter.setName('Text Files');
    dialog.addFilter(filter);

    dialog.connect('response', (responseId: number) => {
      if (responseId === Gtk.ResponseType.OK || responseId == 0) {
        const file = dialog.getFile();
        if (file) {
          const filePath = file.getPath();
          if (filePath) {
            this.loadFile(filePath);
          }
        }
      }
      dialog.close();
    });

    dialog.show();
  }

  applyStyles() {
    const cssProvider = new Gtk.CssProvider();
    const cssData = `
      frame {
        background-color: #f5f5f5;
        border: 2px dashed #bbb;
        border-radius: 10px;
        padding: 10px;
        transition: all 0.3s ease;
        min-height: 100px;
      }
      frame.drag-over {
        background-color: #e3f2fd;
        border-color: #1976d2;
        border-style: solid;
      }
      frame:hover {
        background-color: #eeeeee;
        border-color: #999;
      }
    `;

    cssProvider.loadFromString(cssData);

    const display = Gdk.Display.getDefault();
    if (display) {
      Gtk.StyleContext.addProviderForDisplay(
        display,
        cssProvider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
      );
      console.log('CSS styles loaded successfully');
    }
  }
}

// Usage
// const component = new DragDropComponent();
// component.buildDragDrop(yourParentContainer);