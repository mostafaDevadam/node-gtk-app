
import {Adw, GLib, Gio, Gtk} from '../index.js'



export class MenuLanguagesComponent extends Gio.Menu {

 
   //parent: any
   app: any
   window: any
   menuButton: any
   menu: any
 
   constructor(app: any, window: any) {

    super()
 
     this.app = app
     this.window = window
        
       this.build()
       
 
   }

   build(){
        this.append("English", "app.en")
        this.append("Deutsch", "app.de")
        this.append("Arabic", "app.ar")

        const eAction = Gio.SimpleAction.new('en', null)
        eAction.on('activate', () => {
            this.on_language_action_activated("en")
        })
        this.app.addAction(eAction)

        const zAction = Gio.SimpleAction.new('de', null)
        zAction.on('activate', () => {
            this.on_language_action_activated("de")
        })
        this.app.addAction(zAction)

         const arAction = Gio.SimpleAction.new('ar', null)
        arAction.on('activate', () => {
            this.on_language_action_activated("ar")
        })
        this.app.addAction(arAction)
       
        

       
            

      this.menuButton = new Gtk.MenuButton({
         iconName: 'preferences-desktop-locale-symbolic',
         menuModel: this,
         primary: true,
       })




       
   }
 
 
 

    on_language_action_activated(lang_code: string) {
            if(!lang_code){
              return
            }
            console.log("on_language_action_activated lang_code", lang_code)

            this.app.change_app_language(lang_code)
           
            
    }
   
 
 
   
 
     set_header(header: any){
         header.packEnd(this.menuButton)
     }


}
