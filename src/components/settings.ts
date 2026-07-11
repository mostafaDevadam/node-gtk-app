
import {Adw, GLib, Gio, Gtk} from '../index.js'
import path, { join } from 'path';
import fs from 'fs'
import { StorageService } from '../services/storage.service.js';

export class SettingsComponent {

   app: any
   sidebar_image_container: any

   keyboard_options = ["English (US)", "Arabic", "German (QWERTZ)"]

  constructor(app: any){
     this.app = app
  }


  build_account_view(){

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        const lbl = new Gtk.Label({label: "Account#"})
        //box.append(lbl)

        const group = new Adw.PreferencesGroup()
        //group.setTitle("Account")
        this.app.register_widget(group, "title", "account")
        //self.register_widget(group, "title", "setting_general_item")
        box.append(group)


        const name_row = new Adw.ActionRow({title:"Name", subtitle: this.app.active_user.name ?? "test-name"})
        this.app.register_widget(name_row, "title", "name")
        //name_row.addSuffix(this.app.build_copy_btn(this.app.active_user.name))
        group.add(name_row)

         const email_row = new Adw.ActionRow({title:"Email", subtitle: this.app.active_user.email ?? "test email"})
         this.app.register_widget(email_row, "title", "email")
        //name_row.addSuffix(this.app.build_copy_btn(this.app.active_user.email))
        group.add(email_row)



        
       
        this.app.template_view.build_template_view("Settings","settings_account_view", box)

  }

   build_notifications_view(){

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
        })


        box.setSizeRequest(240, -1)
        //const lbl = new Gtk.Label({label: "Notifications#"})
        //box.append(lbl)

        const group = new Adw.PreferencesGroup()
        //group.setTitle("Notifications")
        this.app.register_widget(group, "title", "notifications")
        //this.app.register_widget(group, "title", "setting_general_item")
        
        const animation_row = new Adw.SwitchRow()
        //animation_row.setTitle("Enable")
        this.app.register_widget(animation_row, "title", "enable")
        //this.app.register_widget(animation_row, "title", "animations")
        group.add(animation_row)
        box.append(group)



        
       
        this.app.template_view.build_template_view("Settings","settings_notifications_view", box)

  }

   build_display_view(){

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        //const lbl = new Gtk.Label({label: "Display#"})
        //box.append(lbl)


        const group = new Adw.PreferencesGroup()
        //group.setTitle("Display")
        this.app.register_widget(group, "title", "display")
        //this.app.register_widget(group, "title", "setting_general_item")
        
        const dark_mode_row = new Adw.SwitchRow()
        //dark_mode_row.setTitle("Dark Mode")
        this.app.register_widget(dark_mode_row, "title", "dark-mode")
        dark_mode_row.connect("notify::active", () => {
          console.log("dark_mode_row")
          const isDarkMode = dark_mode_row.active;
          console.log("dark-mode:", isDarkMode)

          const styleManager = Adw.StyleManager.getDefault();
          styleManager.colorScheme = isDarkMode ? Adw.ColorScheme.PREFER_DARK : Adw.ColorScheme.PREFER_LIGHT;
          
          // save dark-mode in settings.json
          if(this.app){
            const user = this.app.active_user
            const settings_data = {
                "is_dark_mode": isDarkMode,
                "saved_email": user.email,
            }
            StorageService.saveData("storage", "settings", settings_data)
          }
          
        
        })
        //this.app.register_widget(dark_mode_row, "title", "dark_mode")
        group.add(dark_mode_row)
        box.append(group)

         
        //dark_mode_row.connect("notify::active", self.on_dark_mode_toggle_changed)
        //self.register_widget(dark_mode_row, "title", "dark_mode")
        



        
       
        this.app.template_view.build_template_view("Settings","settings_display_view", box)

  }

   build_keyboard_view(){

     const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        //const lbl = new Gtk.Label({label: "Keyboard#"})
        //box.append(lbl)

        this.app.clear_right_sidebar()

        const group = new Adw.PreferencesGroup()
        //group.setTitle("Keyboard")
        this.app.register_widget(group, "title", "keyboard")
        box.append(group)

        this.sidebar_image_container = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 12,
          marginTop: 20,
          marginStart: 16,
          marginEnd: 16,
         
        
        })
        this.app.right_sidebar.append(this.sidebar_image_container)

        //this.keyboard_options = ["English (US)", "Arabic", "German (QWERTZ)"]
        const k_layout_row = new Adw.ComboRow({
          title: "Keyboard Layout"
        })
        this.app.register_widget(k_layout_row, "title", "keyboard-layout")
        //self.register_widget(k_layout_row, "title", "layout_title")
        const k_model = Gtk.StringList.new(this.keyboard_options)
        k_layout_row.setModel(k_model)
        k_layout_row.connect("notify::selected", (combo_row) => {
                  const selected_index = k_layout_row.getSelected()
                  console.log("selected_index:", selected_index)
                  if (selected_index === 4294967295 || selected_index < 0 ){
                      return
                  }
                  
                  this.updated_sidebar_preview_keyboard(selected_index)
        })
        group.add(k_layout_row)
        this.updated_sidebar_preview_keyboard(k_layout_row.getSelected())

        



        
       
        this.app.template_view.build_template_view("Settings","settings_keyboard_view", box)

  }


  updated_sidebar_preview_keyboard(selectedIndex: number){

    console.log("updated_sidebar_preview_keyboard selectedIndex:", selectedIndex)

    this.clear_widget(this.sidebar_image_container)
    const image_files : {[key: number]: string}= {
       0: "en.png",
       1: "ar.png",
       2: "de.png"
    }
    const file_name = image_files[selectedIndex]

    if(!file_name){
      console.warn(`No keyboard preview layout image found for index: ${selectedIndex}`);
      return
    }

    const image_path = join(process.cwd(), "assets", file_name)

    const info_lbl = new Gtk.Label({
      marginBottom: 8,
      cssClasses: ["caption"]

    })
        
        
    const chosen_name = this.keyboard_options[selectedIndex]
    info_lbl.setText(`Visual Blueprint Preview: ${chosen_name}`)
    //const translated_text = this._("visual_blueprint_preview", { name: chosen_name });
    this.app.register_widget(info_lbl, "label", "visual_blueprint_preview", { name: chosen_name })
    //info_lbl.setText(this.app._("visual_blueprint_preview", { name: chosen_name }))
    
    this.sidebar_image_container.append(info_lbl)

    if (fs.existsSync(image_path)){
        console.log(`Success! File found at: ${image_path}`);

        const keyboard_image = Gtk.Picture.newForFilename(image_path)
        this.sidebar_image_container.append(keyboard_image)


    }else {
      return false
    }


   





  }


   clear_widget(widget: any){
        let child = widget.getFirstChild()
        while(child != null){
                  widget.remove(child)
                  child = widget.getFirstChild()
        }
      }

}