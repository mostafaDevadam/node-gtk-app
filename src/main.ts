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
    left_sidebar: any
    right_sidebar: any
    center_stack: any

    constructor() {
      super({applicationId: APP_ID, flags: Gio.ApplicationFlags.FLAGS_NONE })
      //this.toastOverlay = new Adw.ToastOverlay()

      
      
      
      this.on('activate', () => this.do_activate());

      

    }

    private do_activate(): void{
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
      this.left_sidebar = new LeftSidebar()
      // right_sidebar
      this.right_sidebar = new RightSidebar();

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

      // auth-stack
      /*  const auth_nav_stack = new Gtk.Stack({
        transitionType: Gtk.StackTransitionType.NONE,
      })*/
     const auth_nav_stack = new AuthComponent(this)
     this.root_navigation_stack.addNamed(auth_nav_stack, "auth_layout")

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
       
        const test_center_btn = new Gtk.Button({
          label: "Logout",
          marginStart: 20,
          marginTop: 20,
          marginBottom: 20,
          marginEnd: 20,

        })

        test_center_box.append(test_center_btn)
        this.center_stack.addNamed(test_center_box, "test_center_box")

        test_center_btn.on("clicked", () => {
          console.log("test-btn...1")
          //outer_split_view.setVisible(true)
          //root_navigation_stack.setVisibleChildName("login_layout")

          auth_nav_stack.setVisibleChildName("login_layout")
          this.root_navigation_stack.setVisibleChildName("auth_layout")
        })

        















    //

    this.window.present();
    this.loop.run();
           
    }

  

}


const app2 = new App()
app2.run(process.argv)




