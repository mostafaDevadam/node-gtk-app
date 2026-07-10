/*
 * M Node Gtk — an Adwaita application built with node-gtk.
 *
 * Namespaces are imported with the `gi:` scheme (`import Gtk from 'gi:Gtk-4.0'`);
 * the app is run with `node --import node-gtk/register …` (see the package.json
 * scripts). node-gtk integrates the GTK main loop with Node's event loop
 * automatically — there's nothing to call to enable it.
 *
 * One ESM caveat: the blocking run call (`loop.run()` / `app.run()`) RETURNS
 * IMMEDIATELY instead of blocking. So `app.run()` is the last statement and we
 * tear everything down from the window's close handler / quit action.
 * See: https://github.com/romgrk/node-gtk/blob/master/doc/importing.md
 */

import {Adw, GLib, Gio, Gtk} from './index.js'


import { styles } from 'node-gtk/styles'

/*import gi from 'node-gtk';
const GLib = gi.require('GLib', '2.0');
const Gio = gi.require('Gio', '2.0');
const Gtk = gi.require('Gtk', '4.0');
const Adw = gi.require('Adw', '1');*/

// A component in its own module (note the `.js` specifier — TypeScript's NodeNext
// resolution wants the compiled extension even though the file is welcome.ts).
import { createWelcome } from './welcome.js'
import { MainMenu } from './components/main-menu.js'
import { AuthComponent } from './components/auth.js';
import { LeftSidebar } from './components/left_sidebar.js';
import { RightSidebar } from './components/right_sidebar.js';
import { USER } from './types.js';
import { UserRole } from './enums.js';
import { StorageService } from './services/storage.service.js';
import { UserService } from './services/user.service.js';

process.argv = [process.argv[0]];


const APP_ID = 'com.example.MNodeGtk'

const loop = GLib.MainLoop.new(null, false)
const app = new Adw.Application({ applicationId: APP_ID, flags: Gio.ApplicationFlags.FLAGS_NONE })

app.on('activate', () => {
  // Apply style.css, layered on top of Adwaita. Under `npm run dev` the file is
  // re-read live as you edit it — no restart, no flash. style.css sits at the
  // project root, one level up from both src/ (dev, via tsx) and dist/ (built,
  // via node), so this URL resolves in either case.
  styles.addFile(new URL('../style.css', import.meta.url))

  const window = new Adw.ApplicationWindow({ application: app })
  window.setTitle('M Node Gtk')
  window.setDefaultSize(640, 520)

  // ---- header bar with a primary menu ----------------------------------
  const header = new Adw.HeaderBar()

  const menu = new Gio.Menu()
  menu.append('About M Node Gtk', 'app.about')
  menu.append('Quit', 'app.quit')
  menu.append('Info', 'app.info')

  const menuButton = new Gtk.MenuButton({
    iconName: 'open-menu-symbolic',
    menuModel: menu,
    primary: true,
  })
  header.packEnd(menuButton)

  // ---- content: a welcome screen ---------------------------------------
  // Adw.ToastOverlay lets us pop transient "toast" notifications.
  const toast_overlay = new Adw.ToastOverlay({ vexpand: true })

  // The welcome screen lives in its own module (src/welcome.ts) so its inline
  // styles.add() CSS hot-reloads on its own — see that file.
  toast_overlay.setChild(createWelcome(() => {
    toast_overlay.addToast(new Adw.Toast({ title: 'Hello from M Node Gtk 👋' }))
  }))

  // Adw.ApplicationWindow has no built-in title bar, so we stack our own
  // header above the content inside a vertical box.
  const content = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL })
  content.append(header)
  content.append(toast_overlay)
  window.setContent(content)

  // ---- app actions (wired to the menu above) ---------------------------
  const showAbout = () => {
    // Adw.AboutWindow works on libadwaita 1.2+. On 1.5+ you can switch to
    // Adw.AboutDialog (a Gtk.Window-free dialog) if you prefer.
    const about = new Adw.AboutWindow({
      transientFor: window,
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

  const aboutAction = Gio.SimpleAction.new('about', null)
  aboutAction.on('activate', () => showAbout())
  app.addAction(aboutAction)

  const infoAction = Gio.SimpleAction.new('info', null)
  infoAction.on('activate', () => {
    console.log('infoAction...')
  })
  app.addAction(infoAction)
  app.setAccelsForAction('app.info', ['<Control>i'])

  const quitAction = Gio.SimpleAction.new('quit', null)
  quitAction.on('activate', () => { loop.quit(); app.quit() })
  app.addAction(quitAction)
  app.setAccelsForAction('app.quit', ['<Control>q'])

  window.on('close-request', () => (loop.quit(), app.quit(), false))

  styles.install() // flush queued styles and start the dev hot-reload watcher
  window.present()

  // The loop integration is already running; under ESM this returns immediately.
  // The app keeps running until the close handler (or quit action) stops it.
  loop.run()
})

// Must be the last statement — returns immediately under ESM (see top of file).
//app.run([])


class App extends Adw.Application {

    private loop = GLib.MainLoop.new(null, false);
    window: any
    toastOverlay: any
    outer_split_view: any
    root_navigation_stack: any
    auth_nav_stack: any
    left_sidebar: any
    right_sidebar: any
    center_stack: any

    view_stack: any

    active_user: USER = {}
    active_username = ""
    active_user_role: UserRole = UserRole.employee

    constructor() {
      super({applicationId: APP_ID, flags: Gio.ApplicationFlags.FLAGS_NONE })
      //this.toastOverlay = new Adw.ToastOverlay()

      
      
      
      this.on('activate', () => this.do_activate());

      

    }

    private do_activate(): void{
      //

      //
      this.toastOverlay = new Adw.ToastOverlay({ vexpand: true })

     // 1. Create your header bar and content box
    const headerBar = new Adw.HeaderBar();
    

    //   
    const box = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 12,
      marginTop: 24,
      marginBottom: 24,
      marginStart: 24,
      marginEnd: 24,
    });
    box.append(new Gtk.Label({ label: 'Native Libadwaita Layout working!' }));

    // 2. Tie them together inside a ToolbarView
    const toolbarView = new Adw.ToolbarView();
    //toolbarView.addTopBar(headerBar);
    //toolbarView.setContent(box); 

    // 3. FIX: Pass the toolbarView directly into the window using the 'content' property
    this.window = new Adw.ApplicationWindow({ 
      application: this,
      //content: toolbarView // This assigns the root child safely via GObject properties
    });

    // set
    //this.toastOverlay = new Adw.ToastOverlay()
    this.toastOverlay.setChild(headerBar)
    toolbarView.addTopBar(this.toastOverlay)
    //toolbarView.addTopBar(headerBar);
    //toolbarView.setContent(box); 
     
    //toolbarView.setContent(self.root_navigation_stack)
    this.window.setContent(toolbarView)

    this.window.setTitle('M Node Gtk (TypeScript)');
    this.window.setDefaultSize(640, 520);

    this.window.on('close-request', (): boolean => {
      this.loop.quit();
      this.quit();
      return false; 
    });
     //

      //this.mainMenuActions()
      //headerBar.packEnd(this.mainMenu())
      const menu = new MainMenu(this, this, this.window)
      menu.set_header(headerBar)
     

      // left_sidebar
      this.left_sidebar = new LeftSidebar(this)
      // right_sidebar
      this.right_sidebar = new RightSidebar();

      
      //left: 1.view-stack 2.tab-box 3.listbox 4.items 5.page
      // 1.view-stack
        this.view_stack = new Adw.ViewStack({
          vexpand: true,
          marginStart: 8,
          marginEnd: 8
        })
        

      // home-tab  
      // 2.tab-box
      const tab_box_1 = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        marginTop: 12,
      })
      tab_box_1.append(new Gtk.Label({label: "Tab1"}))
      

      // 3.listbox
      const list_box_1 = new Gtk.ListBox()
      list_box_1.addCssClass("boxed-list")
       tab_box_1.append(list_box_1)

      // 4.items
      const home_items = [
        {"key": "item_bookings", icon: "folder-download-symbolic"},
        {"key": "item_trips", icon: "drive-harddisk-symbolic"},
        {"key": "item_buses", icon: "drive-harddisk-symbolic"},
        {"key": "item_history", icon: "drive-harddisk-symbolic"},
        {"key": "item_audit_logs", icon: "drive-harddisk-symbolic"},

      ]

      for(const item of home_items){

        const row = new Adw.ActionRow({
          marginStart: 8,
          marginEnd: 8,
        })
        row.setTitle(item.key)   
        row.setActivatable(true)
        const icon_prefix = Gtk.Image.newFromIconName(item.icon)
        row.addPrefix(icon_prefix)
        const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
        row.addSuffix(icon_suffix)
        row.connect("activated", ()=>this.on_home_item_clicked(item))
        list_box_1.append(row)
         
      }

      // 5.page
      const page_wrapper_1 = this.view_stack.addTitled(tab_box_1, "Home", "home")
      page_wrapper_1.setIconName("user-home-symbolic")


      // settings tab
      // 2.tab-box
      const tab_box_2 = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        marginTop: 12,
      })
      tab_box_2.append(new Gtk.Label({label: "Tab1"}))
      

      // 3.listbox
      const list_box_2 = new Gtk.ListBox()
      list_box_2.addCssClass("boxed-list")
       tab_box_2.append(list_box_2)

      // 4.items
      const settings_items = [
        {"key": "item_account", icon: "folder-download-symbolic"},
        {"key": "item_notifications", icon: "drive-harddisk-symbolic"},
        {"key": "item_display", icon: "drive-harddisk-symbolic"},
        {"key": "item_keyboard", icon: "drive-harddisk-symbolic"},

      ]

      for(const item of settings_items){

        const row = new Adw.ActionRow({
          marginStart: 8,
          marginEnd: 8,
        })
        row.setTitle(item.key)   
        row.setActivatable(true)
        const icon_prefix = Gtk.Image.newFromIconName(item.icon)
        row.addPrefix(icon_prefix)
        const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
        row.addSuffix(icon_suffix)
        row.connect("activated", ()=>this.on_home_item_clicked(item))
        list_box_2.append(row)
         
      }

      // 5.page
      const page_wrapper_2 = this.view_stack.addTitled(tab_box_2, "Settings", "settings")
      page_wrapper_2.setIconName("user-home-symbolic")


       // profile-tab  
      // 2.tab-box
      const tab_box_3 = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        marginTop: 12,
      })
      tab_box_3.append(new Gtk.Label({label: "Tab1"}))
      

      // 3.listbox
      const list_box_3 = new Gtk.ListBox()
      list_box_3.addCssClass("boxed-list")
       tab_box_3.append(list_box_3)

      // 4.items
      const profile_items = [
        {"key": "item_info", icon: "folder-download-symbolic"},
        {"key": "item_address", icon: "drive-harddisk-symbolic"},
        //{"key": "item_bus's", icon: "drive-harddisk-symbolic"},
       

      ]

      for(const item of profile_items){

        const row = new Adw.ActionRow({
          title: item.key,
          marginStart: 8,
          marginEnd: 8,
          activatable: true,
        })
        const icon_prefix = Gtk.Image.newFromIconName(item.icon)
        row.addPrefix(icon_prefix)
        const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
        row.addSuffix(icon_suffix)
        row.connect("activated", ()=>this.on_home_item_clicked(item))
        list_box_3.append(row)
         
      }

      // 5.page
      const page_wrapper_3 = this.view_stack.addTitled(tab_box_3, "Profile", "profile")
      page_wrapper_3.setIconName("user-home-symbolic")


      /*
      
      
      */
     // view_switcher
     const view_switcher = new Adw.ViewSwitcher({
      marginTop: 6,
      marginStart: 2,
      marginEnd: 2,
      policy: Adw.ViewSwitcherPolicy.WIDE,
      //cssClasses: ["custom-view-switcher-bg"],
      stack: this.view_stack,
     })
     view_switcher.addCssClass("custom-view-switcher-bg")
      

      // left_sidebar.append(self.view_stack)
      this.left_sidebar.append(view_switcher)
      this.left_sidebar.append(this.view_stack)
      




      // center_stack
      this.center_stack = new Gtk.Stack({
        transitionType: Gtk.StackTransitionType.CROSSFADE,
        hexpand: true,
        vexpand: true,
      })

     

      // scroll
      /*const scroll_win = new Gtk.ScrolledWindow({
        vexpand: true,
        hexpand: true,
      })
      scroll_win.setPolicy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)*/

      // inner_split_view
     const inner_split_view = new Adw.OverlaySplitView()
      inner_split_view.setSidebar(this.left_sidebar)
      inner_split_view.setContent(this.center_stack)
      inner_split_view.setSidebarPosition(Gtk.PackType.START)
      inner_split_view.setMinSidebarWidth(200)

      // outer_split_view
      this.outer_split_view = new Adw.OverlaySplitView()
      this.outer_split_view.setSidebar(this.right_sidebar)
      this.outer_split_view.setContent(inner_split_view)
      this.outer_split_view.setSidebarPosition(Gtk.PackType.END)
      //outer_split_view.setMinSidebarWidth(340)
      //outer_split_view.setMaxSidebarWidth(360)

      // root_navigation_stack
       this.root_navigation_stack = new Gtk.Stack({
        transitionType: Gtk.StackTransitionType.NONE,
      })

      this.root_navigation_stack.addNamed(this.outer_split_view, "main_layout")
      toolbarView.setContent(this.root_navigation_stack)

      

        //
        



        //
     this.auth_nav_stack = new AuthComponent(this)
     this.auth_nav_stack.setVisible(false)
     this.root_navigation_stack.addNamed(this.auth_nav_stack, "auth_layout")

     this.check_auto_login()

        // test in center_stack
         const test_center_box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL,
          spacing: 12,
          marginTop: 24,
          marginBottom: 24,
          marginStart: 24,
          marginEnd: 24,
        });
        test_center_box.append(new Gtk.Label({ label: 'test_center_box' }));
       
        const test_logout_btn = new Gtk.Button({
          label: "Logout",
          marginStart: 20,
          marginTop: 20,
          marginBottom: 20,
          marginEnd: 20,

        })

        test_center_box.append(test_logout_btn)
        this.center_stack.addNamed(test_center_box, "test_center_box")

        test_logout_btn.on("clicked", async () => {
          console.log("test-btn...1")
          //outer_split_view.setVisible(true)
          //root_navigation_stack.setVisibleChildName("login_layout")
          const removed = await StorageService.removeJsonFile("storage", "config")

          if(removed){
            this.auth_nav_stack.setVisible(true)
            this.outer_split_view.setVisible(false)
            this.auth_nav_stack.setVisibleChildName("login_layout")
            this.root_navigation_stack.setVisibleChildName("auth_layout")
          }

         
         
        })

        















    //

    this.window.present();
    this.loop.run();
           
    }


    on_home_item_clicked(row: any) {
      const key = row.key
      console.log("on_home_item_clicked:", key)
      const lbl = new Gtk.Label()

     this.clear_center_stack()
                       

      switch(key){


        // home
        case "item_bookings":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("bookings")
          this.center_stack.addNamed(lbl, "home_bookings_view")
          this.center_stack.setVisibleChildName("home_bookings_view")
        break

        case "item_trips":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("trips")
          this.center_stack.addNamed(lbl, "home_trips_view")
          this.center_stack.setVisibleChildName("home_trips_view")
        break

        case "item_buses":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("buses")
          this.center_stack.addNamed(lbl, "home_buses_view")
          this.center_stack.setVisibleChildName("home_buses_view")
        break

        case "item_history":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("history")
          this.center_stack.addNamed(lbl, "home_history_view")
          this.center_stack.setVisibleChildName("home_history_view")
        break

        case "item_audit_logs":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("audit logs")
          this.center_stack.addNamed(lbl, "home_audit_logs_view")
          this.center_stack.setVisibleChildName("home_audit_logs_view")
        break



        // settings
        case "item_account":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("settings account")
          this.center_stack.addNamed(lbl, "settings_account_view")
          this.center_stack.setVisibleChildName("settings_account_view")
        break

        case "item_notifications":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("settings notifications")
          this.center_stack.addNamed(lbl, "settings_notifications_view")
          this.center_stack.setVisibleChildName("settings_notifications_view")
        break

        case "item_display":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("settings display")
          this.center_stack.addNamed(lbl, "settings_display_view")
          this.center_stack.setVisibleChildName("settings_display_view")
        break

        case "item_keyboard":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("settings keyboard")
          this.center_stack.addNamed(lbl, "settings_keyboard_view")
          this.center_stack.setVisibleChildName("settings_keyboard_view")
        break

        // profile
        case "item_info":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          lbl.setText("profile info")
          this.center_stack.addNamed(lbl, "profile_info_view")
          this.center_stack.setVisibleChildName("profile_info_view")
        break

        case "item_address":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          //const lbl = new Gtk.Label({label: "profile info"})
          lbl.setText("profile address")
          this.center_stack.addNamed(lbl, "profile_address_view")
          this.center_stack.setVisibleChildName("profile_address_view")
        break

      }

    }


    clear_center_stack(){
       let child = this.center_stack.getFirstChild()
      while(child != null){
                this.center_stack.remove(child)
                child = this.center_stack.getFirstChild()
       }
    }


    async check_auto_login(){
          const config = await StorageService.readFromJsonAsObject("storage", "config") as {auto_login: boolean, saved_email: string}

          if(!config || !config.saved_email || !config.auto_login) {
            console.log("no config for auto-login")
            this.auth_nav_stack.setVisible(true)
            this.outer_split_view.setVisible(false)
            
            this.root_navigation_stack.setVisibleChildName("auth_layout")
            this.auth_nav_stack.setVisibleChildName("login_layout")
            return
          }

          console.log("check_auto_login config:", config)


          const userService = new UserService()
          //if(config.includes)
          const user = await userService.getUserByEmail(config.saved_email)

          if(!user){
            console.log("user is not found!")
            this.auth_nav_stack.setVisible(true)
            this.outer_split_view.setVisible(false)
            this.root_navigation_stack.setVisibleChildName("auth_layout")
            this.auth_nav_stack.setVisibleChildName("login_layout")
            return
          }

          console.log("check_auto_login user:", user)

          this.active_user = user
          this.active_user_role = user.role
          this.active_username = user.name
          
           if(this.left_sidebar){
              this.left_sidebar.updateLeftLabel(user.name)
            }
          this.outer_split_view.setVisible(true)
          this.root_navigation_stack.setVisibleChildName("main_layout")


    }

  

}


const app2 = new App()
app2.run(process.argv)




