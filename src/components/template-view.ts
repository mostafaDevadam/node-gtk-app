

import {Adw, GLib, Gio, Gtk} from '../index.js'



export class TemplateViewComponent {

  app: any
  constructor(app: any){
    this.app = app
  }

  build_template_view(action_bar_title: any, layout_name: any, box: any) {

       const action_bar = new Gtk.HeaderBar({
        showTitleButtons: false,
       })
        const actionBar_title = new Gtk.Label({label: action_bar_title})
        actionBar_title.addCssClass("heading")
        // add actionBar_title in action_bar
        action_bar.setTitleWidget(actionBar_title)
        const wrapper = new Adw.ToolbarView()
        // add action_bar in wrapper
        wrapper.addTopBar(action_bar)
        //
        const scroll_win = new Gtk.ScrolledWindow()
        scroll_win.setPolicy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
        //
        
        const content_box = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, 
          spacing: 12,
          marginTop: 20,
          marginBottom: 24,
          marginStart: 24,
          marginEnd: 24,
        })
        //# add box in content-box
        content_box.append(box)
        //# add content-box in scroll
        scroll_win.setChild(content_box)
        //# add scroll in wrapper
        wrapper.setContent(scroll_win)

        this.safely_add_to_center_stack(wrapper, layout_name)


                       
    }


    private safely_add_to_center_stack(widget: any, key: any) {
        const existing = this.app.center_stack.getChildByName(key)
        if (existing){
           this.app.center_stack.remove(existing)
        }
           
        this.app.center_stack.addNamed(widget, key)
    }
}
