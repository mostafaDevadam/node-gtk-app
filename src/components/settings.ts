
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
        box.append(lbl)

        const group = new Adw.PreferencesGroup()
        //self.register_widget(group, "title", "setting_general_item")
        box.append(group)


        const name_row = new Adw.ActionRow({title:"Name", subtitle: this.app.active_user.name ?? "test-name"})
        //name_row.addSuffix(this.app.build_copy_btn(this.app.active_user.name))
        group.add(name_row)

         const email_row = new Adw.ActionRow({title:"Email", subtitle: this.app.active_user.email ?? "test email"})
        //name_row.addSuffix(this.app.build_copy_btn(this.app.active_user.email))
        group.add(email_row)



        
       
        this.app.template_view.build_template_view("Account","settings_account_view", box)

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
        const lbl = new Gtk.Label({label: "Notifications#"})
        box.append(lbl)

        const group = new Adw.PreferencesGroup()
        group.setTitle("Notifications")
        //this.app.register_widget(group, "title", "setting_general_item")
        
        const animation_row = new Adw.SwitchRow()
        animation_row.setTitle("Enable")
        //this.app.register_widget(animation_row, "title", "animations")
        group.add(animation_row)
        box.append(group)



        
       
        this.app.template_view.build_template_view("Notifications","settings_notifications_view", box)

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
        const lbl = new Gtk.Label({label: "Display#"})
        box.append(lbl)


        const group = new Adw.PreferencesGroup()
        group.setTitle("Display")
        //this.app.register_widget(group, "title", "setting_general_item")
        
        const dark_mode_row = new Adw.SwitchRow()
        dark_mode_row.setTitle("Dark Mode")
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
        



        
       
        this.app.template_view.build_template_view("Display","settings_display_view", box)

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
        const lbl = new Gtk.Label({label: "Keyboard#"})
        box.append(lbl)

        this.app.clear_right_sidebar()

        const group = new Adw.PreferencesGroup()
        group.setTitle("Display")
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

        



        
       
        this.app.template_view.build_template_view("Keyboard","settings_keyboard_view", box)

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
    this.sidebar_image_container.append(info_lbl)

    if (fs.existsSync(image_path)){
        console.log(`Success! File found at: ${image_path}`);

        const keyboard_image = Gtk.Picture.newForFilename(image_path)
        this.sidebar_image_container.append(keyboard_image)


    }else {
      return false
    }


    /*
        image_files = {
            0: "en.png",
            1: "ar.png",
            2: "de.png"
        }
        #
        file_name = image_files.get(selected_index, "en.png")
        #
        image_path = os.path.join(GLib.get_current_dir(), "assets", file_name)
        #
        info_lbl = Gtk.Label()
        info_lbl.add_css_class("caption")
        info_lbl.set_margin_bottom(8)
        #
        chosen_name = self.keyboard_options[selected_index]
        info_lbl.set_text(f"Visual Blueprint Preview: {chosen_name}")
        self.sidebar_image_container.append(info_lbl)
        #
        print(f"image path: {image_path}")
        #
        
        
        #
        if os.path.exists(image_path):
            #keyboard_image = Gtk.Image.new_from_file(image_path)
            keyboard_image = Gtk.Picture.new_for_filename(image_path)
            #
            #keyboard_image.set_hexpand(True)
            #keyboard_image.set_vexpand(True)
            #
            
            self.sidebar_image_container.append(keyboard_image)
            #self.sidebar_image_container.append(Gtk.Image.new_from_file(os.path.join(GLib.get_current_dir(), "assets", "en.png")))
        else:
            return False
        #
        self.right_sidebar.queue_allocate()
    
    
    */





  }


   clear_widget(widget: any){
        let child = widget.getFirstChild()
        while(child != null){
                  widget.remove(child)
                  child = widget.getFirstChild()
        }
      }

}