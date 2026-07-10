
import {Adw, GLib, Gio, Gtk} from '../index.js'


export class ProfileComponent {

  app: any
  //template_view: TemplateViewComponent
  constructor(app: any){
     this.app = app
     //this.template_view = new TemplateViewComponent(this.app)
  }

  build_info_view(){

    const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        const lbl = new Gtk.Label({label: "info#"})
        box.append(lbl)

        const group = new Adw.PreferencesGroup()
        //self.register_widget(group, "title", "setting_general_item")
        
        //const animation_row = new Adw.SwitchRow()
        //self.register_widget(animation_row, "title", "animations")
        //group.add(animation_row)
        box.append(group)


        const name_row = new Adw.ActionRow({title:"Name", subtitle: this.app.active_user.name ?? "test-name"})
        if(this.app){
          name_row.addSuffix(this.app.build_copy_btn(this.app.active_user.name))
        }
        group.add(name_row)

        const email_row = new Adw.ActionRow({title:"Email", subtitle: this.app.active_user.email ?? "test email"})
        email_row.addSuffix(this.app.build_copy_btn(this.app.active_user.email))
        group.add(email_row)



        
        //const temp = new TemplateViewComponent(this)
        this.app.template_view.build_template_view("Info","profile_info_view", box)

  }

  build_address_view(){

    const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
         
        
        })
        box.setSizeRequest(240, -1)
        const lbl = new Gtk.Label({label: "address#"})
        box.append(lbl)

        const group = new Adw.PreferencesGroup()
        box.append(group)

        const street_row = new Adw.ActionRow({title:"Street", subtitle: "test-street"})
        if(this.app){
          street_row.addSuffix(this.app.build_copy_btn("schluss"))
        }
        
        group.add(street_row)

         const city_row = new Adw.ActionRow({title:"City", subtitle: "test-city"})
        city_row.addSuffix(this.app.build_copy_btn("kiel"))
        group.add(city_row)



       
        //const temp = new TemplateViewComponent(this)
        this.app.template_view.build_template_view("Address","profile_address_view", box)

  }
}