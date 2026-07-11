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

import {Adw, GLib, Gio, Gtk, Gdk, GObject} from './index.js'


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
import { TabBoxComponent } from './components/tabbox.js';
import { TemplateViewComponent } from './components/template-view.js';
import path, { join } from 'path';
import fs from 'fs'
import { ProfileComponent } from './components/profile.js';
import { BookingsComponent } from './components/bookings.js';
import { TripsComponent } from './components/trips.js';
import { BusesComponent } from './components/buses.js';
import { HistoryComponent } from './components/history.js';
import { AuditLogsComponent } from './components/auditlogs.js';
import { SettingsComponent } from './components/settings.js';
process.argv = [process.argv[0]];


const APP_ID = 'com.example.MNodeGtk'
/*
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
*/




import i18next from 'i18next';
// Using standard node imports for your local translation JSON files
import enTranslation from '../locales/en.json' with { type: 'json' };
import esTranslation from '../locales/es.json' with { type: 'json' };
import deTranslation from '../locales/de.json' with { type: 'json' };
import arTranslation from '../locales/ar.json' with { type: 'json' };
import { MenuLanguagesComponent } from './components/menu_lang.js';

// Simple helper to check the Linux system language environment variable (e.g., "en_US.UTF-8" -> "en")
const systemLang = (process.env.LANG || 'en').split('_')[0].split('.')[0];

async function initI18n() {
    await i18next.init({
        lng: systemLang,       // Use the detected OS language
        fallbackLng: 'en',     // Default to English if system lang isn't supported yet
        resources: {
            en: { translation: enTranslation },
            es: { translation: esTranslation }
        }
    });

    // Make the standard global _() translation macro shortcut accessible anywhere in your code
    (globalThis as any)._ = (key: string) => i18next.t(key);
}

// Call this before building your GTK Windows!
//await initI18n();








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

    nav_views: Record<string, any> = {}

    template_view: TemplateViewComponent
    profile_comp: ProfileComponent
    bookings_comp: BookingsComponent
    trips_comp: TripsComponent
    buses_comp : BusesComponent
    history_comp: HistoryComponent
    audit_logs_comp: AuditLogsComponent 
    settings_comp: SettingsComponent

    private registered_widgets: Array<{ widget: any, prop: string, key: string }> = [];

    _: any

    currentLang = "en"

    constructor() {
      super({applicationId: APP_ID, flags: Gio.ApplicationFlags.FLAGS_NONE })
      //this.toastOverlay = new Adw.ToastOverlay()

      
      this.template_view = new TemplateViewComponent(this)
      this.profile_comp = new ProfileComponent(this)
      this.bookings_comp = new BookingsComponent(this)
      this.trips_comp = new TripsComponent(this)
      this.buses_comp = new BusesComponent(this)
      this.history_comp = new HistoryComponent(this)
      this.audit_logs_comp = new AuditLogsComponent(this)
      this.settings_comp = new SettingsComponent(this)





      // 1. Run initialization tasks first (like loading translations)
      this.on('startup', async () => {
            try {
                this.hold(); // Tells GTK to wait while we run our async Node task
                await this.initI18n();
            } catch (err) {
                console.error("Failed to load translations:", err);
            } finally {
                this.release(); // Tells GTK our async task is done, safe to proceed
            }
        });
      
      this.on('activate', () => this.do_activate());

      

    }


    private async initI18n(): Promise<void> {
        const systemLang = (process.env.LANG || 'de').split('_')[0].split('.')[0];

          // 2. Determine default locale matching the current layout text direction fallback
        const curr_direction = Gtk.Widget.getDefaultDirection();
        const directionLang = (curr_direction === Gtk.TextDirection.RTL) ? "ar" : "en";

        // 3. Priority Ladder: Use explicit tracker value -> fallback to system environment locale -> fallback to text layout baseline
        const activeLocale = this.currentLang || systemLang || directionLang;

        await i18next.init({
            lng: activeLocale,
            fallbackLng: 'en',
            resources: {
                en: { translation: enTranslation },
                //es: { translation: esTranslation }
                de: {translation: deTranslation },
                ar: {translation: arTranslation }
            }
        });

        // Establish our global micro-shorthand helper macro
        (globalThis as any)._ = (key: string) => i18next.t(key);
        this._ = (key: string) => i18next.t(key)
    }


    refresh_row_dictionaries(){
         console.log("refresh_row_dictionaries lang:", this.currentLang)
        const target_dictionaries = ['nav_views', 'nav_settings_rows', 'nav_profile_rows'] as const;
    
    target_dictionaries.forEach(dictKey => {
        // Safely access the target object dictionary profile (e.g., this.nav_views)
        const currentDict = (this as any)[dictKey];
        if (!currentDict) return;

        console.log("target_dictionaries currentDict: ", currentDict)

        for (let row_attr in currentDict) {
            const currentView = currentDict[row_attr];
            if (!currentView) continue;

            // Compute your translation string path key
            // This transforms keys like "profile_settings" -> "sidebar.profile_settings" 
            // or handles standard items directly depending on how your i18n JSON is structured
            const translationKey = row_attr.startsWith("item_") ? `${row_attr.replace("item_", "")}` : `${row_attr}`;
            const translatedText = this._(translationKey);

            // 1. Update the internal tracker text property just in case
            if ("label" in currentView) {
                currentView["label"] = translatedText;
            }

            // 2. FORCE GTK TO RENDER THE CHANGE ON-SCREEN:
            // Check if the view itself is a standard widget, or has a setter method
            if (typeof currentView.setLabel === 'function') {
                currentView.setLabel(translatedText);
            } 
            else if (typeof currentView.setTitle === 'function') {
                currentView.setTitle(translatedText);
            }
            // If your custom view holds an internal child label element (e.g., currentView.titleLabel)
            else if (currentView.titleLabel && typeof currentView.titleLabel.setLabel === 'function') {
                currentView.titleLabel.setLabel(translatedText);
            }

            console.log("currentView:", currentView)


             this.update_widget_text(currentView, "title", currentView.key);
        }
    });
            /*if hasattr(self, row_attr):
                row_dict = getattr(self, row_attr)
                if row_dict:
                    for key, row_widget in row_dict.items():
                        if hasattr(row_widget, "set_title"):
                            row_widget.set_title(self.i18n._(key))*/
     }

     public refresh_all_translations() {
          this.registered_widgets.forEach(({ widget, prop, key }) => {
              this.update_widget_text(widget, prop, key);
          });
      }

     register_widget(widget: any, prop: any, key: any){
       /*this.registered_widgets.forEach(({ widget, prop, key }) => {
        this.update_widget_text(widget, prop, key);
       }); */
       this.registered_widgets.push({widget, prop, key})

       this.update_widget_text(widget, prop, key);
    }

    update_widget_text(widget: any, prop: any, key: any){
        if (!widget) return;
    
        const translated_text = this._(key);

        switch(prop) {
            case "label":
                // Used by Gtk.Label, Gtk.Button, Gtk.CheckButton
                if (typeof widget.setLabel === 'function') widget.setLabel(translated_text);
                widget.setLabel(translated_text)
                break;

            case "title":
                // Used by Gtk.Window, Adw.ApplicationWindow, Adw.ActionRow, Adw.HeaderBar
                if (typeof widget.setTitle === 'function') widget.setTitle(translated_text);
                break;

            case "subtitle":
                // Used by Adw.ActionRow, Adw.ExpanderRow
                if (typeof widget.setSubtitle === 'function') widget.setSubtitle(translated_text);
                break;

            case "placeholder":
                // Fix: Gtk.Entry and Gtk.PasswordEntry use 'setPlaceholderText'
                if (typeof widget.setPlaceholderText === 'function') widget.setPlaceholderText(translated_text);
                break;

            case "tooltip":
                // Used by absolutely any Gtk.Widget on hover
                if (typeof widget.setTooltipText === 'function') widget.setTooltipText(translated_text);
                break;
                
            default:
                console.warn(`[i18n] Property handler for "${prop}" is not implemented.`);
        }
          
    }


    async change_app_language(lang_code: string){

      console.log("change_app_language lang_code:", lang_code)

      const next_lang = lang_code

       try {
          await i18next.changeLanguage(next_lang)
          this.currentLang = next_lang
          
              if (this.window) {
                const targetDirection = (next_lang === "ar") ? Gtk.TextDirection.RTL : Gtk.TextDirection.LTR;
                
                // Fix 1: Try the standard snake_case binding method if camelCase failed
                if (typeof (this.window as any).setDirection === 'function') {
                    this.window.setDirection(targetDirection);
                } else if (typeof (this.window as any).set_direction === 'function') {
                    (this.window as any).set_direction(targetDirection);
                }

                // Fix 2: Set the default direction globally so any newly navigated/built views inherit it
                Gtk.Widget.setDefaultDirection(targetDirection);

                // Force redraw
                this.window.queueDraw();
                this.window.queueResize();


      

          }


          

          this.refresh_all_translations();

          // 2. FORCE the active page layout view dictionary to re-sync
          if (typeof this.refresh_row_dictionaries === 'function') {
              this.refresh_row_dictionaries();
          }



           console.log("Language successfully switched to:", next_lang);
        } catch (error) {
          console.error("Failed to dynamically switch language:", error);
        }



    }



    private do_activate(): void{
      //
      styles.addFile(new URL('../style.css', import.meta.url))

      //
     /* const curr_direction = Gtk.Widget.getDefaultDirection()

      if (curr_direction == Gtk.TextDirection.RTL){
          i18next.changeLanguage("ar")
          this.currentLang = "ar"
      }else {
          i18next.changeLanguage("en")
          this.currentLang = "en"
      }*/
      //
      this.toastOverlay = new Adw.ToastOverlay({ vexpand: true })

     // 1. Create your header bar and content box
    const headerBar = new Adw.HeaderBar();

    //
    this.refresh_row_dictionaries()
    

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

    if (this.currentLang === "ar") {
        this.window.setDirection(Gtk.TextDirection.RTL);
    } else {
        this.window.setDirection(Gtk.TextDirection.LTR);
    }

    // set
    //this.toastOverlay = new Adw.ToastOverlay()
    this.toastOverlay.setChild(headerBar)
    toolbarView.addTopBar(this.toastOverlay)
    //toolbarView.addTopBar(headerBar);
    //toolbarView.setContent(box); 
     
    //toolbarView.setContent(self.root_navigation_stack)
    this.window.setContent(toolbarView)

    this.window.setTitle('M Node Gtk (TypeScript)');
    this.window.setDefaultSize(800, 700);

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

      // lang-menu
      const lang_menu = new MenuLanguagesComponent(this, this.window)
      lang_menu.set_header(headerBar)

     
     

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
      const tab_box_1 = new TabBoxComponent(this, "Home", "home", "user-home-symbolic")
     
      

      // 3.listbox
      const list_box_1 = new Gtk.ListBox()
      list_box_1.addCssClass("boxed-list")
       tab_box_1.append(list_box_1)

      // 4.items
      const home_items = [
        { "key": "bookings", "icon": "x-office-calendar-symbolic", "label": this._("bookings") },
        { "key": "trips", "icon": "preferences-system-network-symbolic", "label": this._("trips") },
        { "key": "buses", "icon": "avatar-default-symbolic", "label": this._("buses") }, // alternative standard: "view-grid-symbolic"
        { "key": "history", "icon": "document-open-recent-symbolic", "label": this._("history") },
        { "key": "audit_logs", "icon": "view-list-ordered-symbolic","label": this._("audit_logs") }

      ]

       this.nav_views = tab_box_1.build(list_box_1, home_items, this.nav_views)

     

     
      


      // settings tab
      // 2.tab-box
      const tab_box_2 = new TabBoxComponent(this, "Settings", "settings", "user-home-symbolic")
      // 3.listbox
      const list_box_2 = new Gtk.ListBox()
      list_box_2.addCssClass("boxed-list")
       tab_box_2.append(list_box_2)

      // 4.items
      const settings_items = [
        {"key": "account", icon: "avatar-default-symbolic", label: this._("account")},
        {"key": "notifications", icon: "preferences-system-notifications-symbolic", label: this._("notifications")},
        {"key": "display", icon: "video-display-symbolic", label: this._("display")},
        {"key": "keyboard", icon: "input-keyboard-symbolic", label: this._("keyboard")},

      ]

       this.nav_views  = tab_box_2.build(list_box_2, settings_items, this.nav_views)

    


       // profile-tab  
      // 2.tab-box
      const tab_box_3 = new TabBoxComponent(this, "Profile", "profile", "user-home-symbolic")
      /*const tab_box_3 = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
        marginTop: 12,
      })
      tab_box_3.append(new Gtk.Label({label: "Tab1"}))*/
      

      // 3.listbox
      const list_box_3 = new Gtk.ListBox()
      list_box_3.addCssClass("boxed-list")
       tab_box_3.append(list_box_3)

      // 4.items
      const profile_items = [
        {"key": "profile_info", icon: "user-info-symbolic", label: this._("profile_info")},
        {"key": "profile_address", icon: "mark-location-symbolic", label: this._("profile_address")},
      ]

       this.nav_views = tab_box_3.build(list_box_3, profile_items, this.nav_views)

      /*for(const item of profile_items){

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
      page_wrapper_3.setIconName("user-home-symbolic")*/


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
      styles.install()
      this.window.present();
      this.loop.run();
           
    }


    on_home_item_clicked(row: any) {
      const key = row.key
      console.log("on_home_item_clicked:", key)
      const lbl = new Gtk.Label()

     this.clear_center_stack()
     this.clear_right_sidebar()
                       

      switch(key){
        // home
        case "bookings":
          //this.right_sidebar.append(new Gtk.Label({label: "profile info"}))
          //lbl.setText("bookings")
          //this.center_stack.addNamed(lbl, "home_bookings_view")
          this.bookings_comp.build_bookings_view()
          this.center_stack.setVisibleChildName("home_bookings_view")
        break

        case "trips":
          this.trips_comp.build_trips_view()
          this.center_stack.setVisibleChildName("home_trips_view")
        break

        case "buses":
          this.buses_comp.build_trips_view()
          this.center_stack.setVisibleChildName("home_buses_view")
        break

        case "history":
          this.history_comp.build_history_view()
          this.center_stack.setVisibleChildName("home_history_view")
        break

        case "audit_logs":
          this.audit_logs_comp.build_logs_view()
          this.center_stack.setVisibleChildName("home_audit_logs_view")
        break

        // settings
        case "account":
          this.settings_comp.build_account_view()
          this.center_stack.setVisibleChildName("settings_account_view")
        break

        case "notifications":
          this.settings_comp.build_notifications_view()
          this.center_stack.setVisibleChildName("settings_notifications_view")
        break

        case "display":
           this.settings_comp.build_display_view()
          this.center_stack.setVisibleChildName("settings_display_view")
        break

        case "keyboard":
          this.settings_comp.build_keyboard_view()
          this.center_stack.setVisibleChildName("settings_keyboard_view")
        break

        // profile
        case "profile_info":
          this.profile_comp.build_info_view()
          this.center_stack.setVisibleChildName("profile_info_view")
        break

        case "profile_address":
          this.profile_comp.build_address_view()
          this.center_stack.setVisibleChildName("profile_address_view")
        break

      }

    }




   


    safely_add_to_center_stack(widget: any, key: any) {
        const existing = this.center_stack.getChildByName(key) //get_child_by_name(key)
        if (existing){
           this.center_stack.remove(existing)
        }
           
        this.center_stack.addNamed(widget, key)
    }

  
    clear_right_sidebar(){
        let child = this.right_sidebar.getFirstChild()
        while(child != null){
                  this.right_sidebar.remove(child)
                  child = this.right_sidebar.getFirstChild()
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

          const settings = await StorageService.readFromJsonAsObject("storage", "settings") as {is_dark_mode: boolean, saved_email: string}

    
           if(!settings || !settings.saved_email || !settings.is_dark_mode) { 
            console.log("No settings dark-mode for user")
           }


          const styleManager = Adw.StyleManager.getDefault();
          styleManager.colorScheme = settings.is_dark_mode ? Adw.ColorScheme.PREFER_DARK : Adw.ColorScheme.PREFER_LIGHT;

          this.active_user = user
          this.active_user_role = user.role
          this.active_username = user.name
          
          if(this.left_sidebar){
              this.left_sidebar.updateLeftLabel(user.name)
          }
          this.outer_split_view.setVisible(true)
          this.root_navigation_stack.setVisibleChildName("main_layout")


    }

    build_copy_btn(item: any){

        const box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 10,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
          visible: true
        
        })

        //box.setVisible(false)

        const copy_icon = Gtk.Image.newFromIconName("edit-copy-symbolic")
        copy_icon.setMarginTop(12)

        const copy_lbl = new Gtk.Label({
          label: "Copied",
          visible: false,
          marginTop: 12,

        
        })
        this.register_widget(copy_lbl, "label", "copied")
        //copy_lbl.setVisible(false)

        const copy_item_btn = new Gtk.Button({
          cssClasses: ["flat", "circular"]
        })

         copy_item_btn.setChild(box)
         box.append(copy_icon)
         box.append(copy_lbl)

         //copy_item_btn.setIconName("edit-copy-symbolic")
         //copy_item_btn.setLabel(copy_lbl.getText())
         copy_item_btn.setChild(box)
            
         //copy_item_btn.item = item
         copy_item_btn.connect("clicked", (button) => {

           this.copy(item, copy_icon, copy_lbl, copy_item_btn, button)

         })


         return copy_item_btn

    }

    reset_copy_button(button: any, icon:any, label: any) {
        icon.visible = true;
        label.visible = false;
        button.setSensitive(true);
        button.removeCssClass("circular"); // Or leave it if you prefer it round permanently!
    }

    copy(item: any,copy_icon: any,copy_lbl: any,copy_item_btn: any,   button: any){

       const display = Gdk.Display.getDefault()
            const clipboard = display ? display.getClipboard() : null;
            

            const text_to_copy = typeof item === 'string' ? item : JSON.stringify(item);

            if (text_to_copy && clipboard){

              try {

                const gvalue = new GObject.Value(text_to_copy as String)
               // const provider =  Gdk.ContentProvider.newForValue(gvalue)
                //clipboard?.setContent(provider)

               if (typeof (clipboard as any).setText === 'function') {
                (clipboard as any).setText(text_to_copy);
                } else if (typeof (clipboard as any).set_text === 'function') {
                    (clipboard as any).set_text(text_to_copy);
                } else {
                 
                  const encoder = new TextEncoder();
                  const uint8Array = encoder.encode(text_to_copy);

                  // 2. Pass the typed array to GLib.Bytes
                  // In node-gtk, GLib.Bytes.new() natively takes an array/Uint8Array block directly
                  const plainNumbersArray = Array.from(uint8Array);
                  const gbytes = GLib.Bytes.new(plainNumbersArray);

                  // 3. Create the text/plain provider wrapper using your camelCase structure
                  const provider = Gdk.ContentProvider.newForBytes("text/plain;charset=utf-8", gbytes);

                  // 4. Update the active clipboard content payload
                  clipboard.setContent(provider);

                }

                copy_icon.visible = false;
                copy_lbl.visible = true;
                
                copy_item_btn.addCssClass("circular");
                copy_item_btn.setSensitive(false); // Disable it temporarily so they can't spam click it!
                
                
               GLib.timeoutAddSeconds(0, 5, () => {
                  // Call your reset method using standard JS arrow binding context
                  this.reset_copy_button(copy_item_btn, copy_icon, copy_lbl);
                  return false; // Crucial: Returning false ensures the timeout fires exactly ONCE
              });

                
              } catch (error) {
                console.error("Failed to update system clipboard:", error);
              }
            }

    }


    langbtn(){
       // switch-lang
      /*const lang_btn = new Gtk.Button({label: "Language: EN"})
      let count = 1
      lang_btn.connect("clicked", async () => {
        let btnLabel = "Language: EN";
        let next_lang = "en"
        switch(count){
          case 1:
            next_lang = "en"
            btnLabel = "EN"
          break
           case 2:
            next_lang = "de"
             btnLabel = "DE"
          break
           case 3:
            next_lang = "ar"
             btnLabel = "AR"
          break
        }

        try {
          await i18next.changeLanguage(next_lang)
          this.currentLang = next_lang
          lang_btn.setLabel(btnLabel)


          /*if(this.window){
            if(next_lang === "ar"){ 
              this.window.setDirection(Gtk.TextDirection.RTL)
              this.window.queueDraw()
               
            }else {
              this.window.setDirection(Gtk.TextDirection.LTR)
              this.window.queueDraw()
               
            }*/
/*
              if (this.window) {
                const targetDirection = (next_lang === "ar") ? Gtk.TextDirection.RTL : Gtk.TextDirection.LTR;
                
                // Fix 1: Try the standard snake_case binding method if camelCase failed
                if (typeof (this.window as any).setDirection === 'function') {
                    this.window.setDirection(targetDirection);
                } else if (typeof (this.window as any).set_direction === 'function') {
                    (this.window as any).set_direction(targetDirection);
                }

                // Fix 2: Set the default direction globally so any newly navigated/built views inherit it
                Gtk.Widget.setDefaultDirection(targetDirection);

                // Force redraw
                this.window.queueDraw();
                this.window.queueResize();


      

          }


          

          this.refresh_all_translations();

          // 2. FORCE the active page layout view dictionary to re-sync
          if (typeof this.refresh_row_dictionaries === 'function') {
              this.refresh_row_dictionaries();
          }



           console.log("Language successfully switched to:", next_lang);
        } catch (error) {
          console.error("Failed to dynamically switch language:", error);
        }

        count++

        if(count > 3){
          count = 1
        }

        console.log("lang btn:", count)
           

      })*/

      //headerBar.packStart(lang_btn)
    }


    

}




const app2 = new App()
app2.run(process.argv)




