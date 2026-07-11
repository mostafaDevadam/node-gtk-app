import {Adw, GLib, Gio, Gtk} from '../index.js'
import { APP_ID } from '../main.js'



export class MainMenu {

  parent: any
  app: any
  window: any
  menuButton: any
  menu: any

  constructor(parent: any, app: any, window: any) {

    this.parent = parent
    this.app = app
    this.window = window

      this.menu = new Gio.Menu()
      this.menu.append('About', 'app.about')
      this.menu.append('Quit', 'app.quit')
      this.menu.append('Info', 'app.info')

      this.menuButton = new Gtk.MenuButton({
        iconName: 'open-menu-symbolic',
        menuModel: this.menu,
        primary: true,
      })

      this.mainMenuActions()

  }



   showAbout = () => {
    // Adw.AboutWindow works on libadwaita 1.2+. On 1.5+ you can switch to
    // Adw.AboutDialog (a Gtk.Window-free dialog) if you prefer.
    const about = new Adw.AboutWindow({
      transientFor: this.window,
      applicationName: 'M Node Gtk',
      applicationIcon: APP_ID,
      developerName: 'Your Name',
      version: '0.1.0',
      comments: 'An Adwaita application built with node-gtk.',
      developers: ['Your Name <you@example.com>'],
      copyright: '© 2026 Your Name',
      licenseType: Gtk.License.MIT_X11,
    })
    about.present()
  }


    private mainMenuActions(){
       const aboutAction = Gio.SimpleAction.new('about', null)
        aboutAction.on('activate', () => this.showAbout())
        this.app.addAction(aboutAction)


          const infoAction = Gio.SimpleAction.new('info', null)
            infoAction.on('activate', () => {
              console.log('infoAction...')
              this.app.toastOverlay.addToast(new Adw.Toast({ title: 'Info: Hello from M Node Gtk 👋' }))
            })
      this.app.addAction(infoAction)
      this.app.setAccelsForAction('app.info', ['<Control>i'])

      const quitAction = Gio.SimpleAction.new('quit', null)
      quitAction.on('activate', () => { this.app.loop.quit(); this.app.quit() })
      this.app.addAction(quitAction)
      this.app.setAccelsForAction('app.quit', ['<Control>q'])
    }

    set_header(header: any){
        header.packEnd(this.menuButton)
    }






}