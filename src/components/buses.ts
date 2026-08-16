import { formatDate } from '../common.js';
import { UserRole } from '../enums.js';
import { Adw, GLib, Gio, Gtk } from '../index.js'
import { BusService } from '../services/bus.service.js';
import { BUS } from '../types.js';



export class BusesComponent {

  app: any
  bus_service: BusService
  isEdit: boolean = false
  selected_bus: BUS | null = null
  input_bus_number: any
  input_capacity: any
  input_bus_type: any
  input_chair_count: any
  submit_btn: any

  userId: string = ""

  constructor(app: any) {
    this.app = app
    this.bus_service = new BusService()
  }

  async build_trips_view() {

    this.userId = this.app.active_user.id

    const isAdmin = this.app.active_user_role === UserRole.admin || this.app.active_user_role === "admin";


    const box = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,


    })
    box.setSizeRequest(240, -1)
    //const lbl = new Gtk.Label({label: "Buses#"})
    //box.append(lbl)


    // in right_sidebar
    const sideBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      cssClasses: ['boxed-list'], // Gives it the rounded card look
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,
      visible: false,
    })
    this.app.right_sidebar.append(sideBox)
    const side_title = new Gtk.Label()
    sideBox.append(side_title)

    //
    const edit_side_group = new Adw.PreferencesGroup({ visible: false })
    sideBox.append(edit_side_group)
    // inputs

    this.input_bus_number = new Adw.EntryRow({
      title: "Bus Number",
      inputPurpose: Gtk.InputPurpose.NUMBER,
    })
    edit_side_group.add(this.input_bus_number)

    this.input_capacity = new Adw.EntryRow({
      title: "Capacity",
      inputPurpose: Gtk.InputPurpose.NUMBER,

    })
    edit_side_group.add(this.input_capacity)

    // dropdown-list bus_type
    
    this.input_bus_type = new Adw.EntryRow({
      title: "Bus Type",
      inputPurpose: Gtk.InputPurpose.NAME,

    })
    edit_side_group.add(this.input_bus_type)

    this.input_chair_count = new Adw.EntryRow({
      title: "Chair Count",
      inputPurpose: Gtk.InputPurpose.NUMBER,

    })
    edit_side_group.add(this.input_chair_count)

    this.submit_btn = new Adw.ActionRow({
      title: "save",
      halign: Gtk.Align.CENTER,
      activatable: true,
      visible: isAdmin,
    })
    edit_side_group.add(this.submit_btn)

    this.submit_btn.on("activated", () => {


        const obj: BUS = {
          id: "",
          userId: this.userId,
          bus_number: parseInt(this.input_bus_number.getText()),
          capacity: parseInt(this.input_capacity.getText()),
          bus_type: this.input_bus_type.getText(),
          chair_count: parseInt(this.input_chair_count.getText()),
          created_at: "",
          updated_at: ""

        }
       

        if(this.isEdit && this.selected_bus){
             obj.id = this.selected_bus.id
             obj.created_at = this.selected_bus.created_at
             console.log("submit_btn - activated - isEdit:", this.isEdit, this.selected_bus, obj) 
             this.bus_service.update(obj.id!!, obj)
        }else{
              console.log("submit_btn - activated: - create", this.isEdit, obj)
              this.bus_service.create(obj)    
        }
    
      })
    
   

    //if (!this.isEdit)
    //  this.build_form(edit_side_group, isAdmin, this.isEdit)

    // 
    const view_side_group = new Adw.PreferencesGroup({ visible: false })
    sideBox.append(view_side_group)

    this.build_details(view_side_group)


    if (isAdmin) {
      const add_btn = new Gtk.Button({
        label: "Add",
        halign: Gtk.Align.END,

      })
      box.append(add_btn)
      add_btn.connect("clicked", () => {
        this.selected_bus = null
        this.isEdit = false
        side_title.setText("Add Bus")
        //this.build_form(edit_side_group, isAdmin, this.isEdit)
        this.clearInputs()
        edit_side_group.setVisible(true)
        sideBox.setVisible(true)
      })
    }
    //
    const group = new Adw.PreferencesGroup()
    const listBox = new Gtk.ListBox()
    group.add(listBox)
    box.append(group)


    const list = await this.bus_service.getAll()

    for (let item of list) {
      this.build_card(item, side_title, sideBox, listBox, edit_side_group, view_side_group, isAdmin, this.isEdit)
    }

    /*for (let item of [1, 2, 3]) {
      this.build_card(item, side_title, sideBox, listBox, edit_side_group, view_side_group, isAdmin)
    }*/






    this.app.template_view.build_template_view("Buses", "home_buses_view", box)

  }


  build_form(parent: any, isAdmin: boolean, isEdit: boolean) {

    console.log("build_form() ", isAdmin, this.isEdit, this.selected_bus)

    // Clear old form rows first if you are rebuilding it completely
    let child = parent.getFirstChild()
    while (child != null) {
      let next = child.getNextSibling()
      parent.remove(child)
      child = next
    }

    parent.setVisible(true)


    /*

    if (!this.input_bus_number) {
      // bus_number
      this.input_bus_number = new Adw.EntryRow({
        title: "Bus Number",
        inputPurpose: Gtk.InputPurpose.NUMBER,
        //editable: isAdmin,
        //text: this.selected_bus && isAdmin ? this.selected_bus.bus_number?.toString() : ""


        //marginTop: 20,
      })
      parent.add(this.input_bus_number)
    }



    if (!this.input_capacity) {
      // capacity
      this.input_capacity = new Adw.EntryRow({
        title: "Capacity",
        inputPurpose: Gtk.InputPurpose.NUMBER,
        //editable: isAdmin,
        //text: this.selected_bus && isAdmin ? this.selected_bus.capacity?.toString() : ""

      })
      parent.add(this.input_capacity)
    }




    if (!this.input_bus_type) {
      // bus_type
      this.input_bus_type = new Adw.EntryRow({
        title: "Bus Type",
        inputPurpose: Gtk.InputPurpose.NAME,
        //editable: isAdmin,
        //text: this.selected_bus && isAdmin ? this.selected_bus.bus_type?.toString() : ""

      })
      parent.add(this.input_bus_type)
    }




    if (!this.input_chair_count) {
      // capacity
      this.input_chair_count = new Adw.EntryRow({
        title: "Chair Count",
        inputPurpose: Gtk.InputPurpose.NUMBER,
        //editable: isAdmin,
        //text: this.selected_bus && isAdmin ? this.selected_bus.chair_count?.toString() : ""

      })
      parent.add(this.input_chair_count)
    }
    */



    if (isAdmin) {

      this.input_bus_number.setEditable(isAdmin);
      this.input_capacity.setEditable(isAdmin);
      this.input_bus_type.setEditable(isAdmin);
      this.input_chair_count.setEditable(isAdmin);

      /*if (this.selected_bus) {
        this.input_bus_number.setText(this.selected_bus.bus_number?.toString() ?? "");
        this.input_capacity.setText(this.selected_bus.capacity?.toString() ?? "");
        this.input_bus_type.setText(this.selected_bus.bus_type?.toString() ?? "");
        this.input_chair_count.setText(this.selected_bus.chair_count?.toString() ?? "");

      }*/
    }

    /*  this.input_bus_number.setEditable(isAdmin);
    this.input_bus_number.setText(
      this.selected_bus && isAdmin ? this.selected_bus.bus_number?.toString() : ""
    );

     this.input_capacity.setEditable(isAdmin);
    this.input_capacity.setText(
      this.selected_bus && isAdmin ? this.selected_bus.capacity?.toString() : ""
    );


     this.input_bus_type.setEditable(isAdmin);
    this.input_bus_type.setText(
      this.selected_bus && isAdmin ? this.selected_bus.bus_type?.toString() : ""
    );



    this.input_chair_count.setEditable(isAdmin);
    this.input_chair_count.setText(
      this.selected_bus && isAdmin ? this.selected_bus.chair_count?.toString() : ""
    );*/





    // 
    if (!this.submit_btn) {
      console.log("submit_btn")
      // submit_btn
      /*this.submit_btn = new Adw.ActionRow({
        title: "save",
        halign: Gtk.Align.CENTER,
        activatable: true,
        visible: isAdmin,
      })
      parent.add(this.submit_btn)*/

      /*this.submit_btn.on("activated", () => {
        console.log("submit_btn activated")

        const obj: BUS = {
          id: this.selected_bus?.id ?? "",
          bus_number: parseInt(this.input_bus_number.getText()),
          capacity: parseInt(this.input_capacity.getText()),
          bus_type: this.input_bus_type.getText(),
          chair_count: parseInt(this.input_chair_count.getText()),

        }

        console.log("submit bus:", obj)

        if (this.isEdit && this.selected_bus) {
          this.bus_service.update(this.selected_bus.id!!, obj)
        } else if (!this.isEdit && this.selected_bus) {
          this.bus_service.create(obj)
        }



      })*/
   }

  }

  build_details(parent: any) {

    const view_row = new Adw.ActionRow()
    parent.add(view_row)
    view_row.setTitle(`Bus-lorem`)
    view_row.setSubtitle("Lorem lorem lorem")
    const view_row1 = new Adw.ActionRow()
    parent.add(view_row1)
    view_row1.setTitle(`Bus-lorem 1`)
    view_row1.setSubtitle("Lorem lorem lorem")
    const view_row2 = new Adw.ActionRow()
    parent.add(view_row2)
    view_row2.setTitle(`Bus-lorem 2`)
    view_row2.setSubtitle("Lorem lorem lorem")

  }


  build_card(item: BUS, side_title: any, sideBox: any, listBox: any, edit_side_group: any, view_side_group: any, isAdmin: boolean, isEdit: boolean) {
    const row = new Adw.ActionRow()
    row.setTitle(`Bus-${item.bus_number}`)
    row.setSubtitle(`Chairs: ${item.chair_count}\nDate: ${formatDate(item.created_at!!)}`)
    row.setActivatable(true)
    const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
    row.addPrefix(icon_prefix)
    const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
    row.addSuffix(icon_suffix)
    row.connect("activated", () => {
      // this.app.clear_right_sidebar()
      this.selected_bus = item
      if (isAdmin) {
        this.isEdit = true
        side_title.setText(`Edit Bus ${item.bus_number}`)
        edit_side_group.setVisible(true)
        view_side_group.setVisible(false)
        //sideBox.setVisible(true)
        if (this.selected_bus) {
          this.input_bus_number?.setText(this.selected_bus.bus_number?.toString() ?? "");
          this.input_capacity?.setText(this.selected_bus.capacity?.toString() ?? "");
          this.input_bus_type?.setText(this.selected_bus.bus_type?.toString() ?? "");
          this.input_chair_count?.setText(this.selected_bus.chair_count?.toString() ?? "");

        }
      } else {
        this.isEdit = false
        side_title.setText(`Bus ${item.bus_number}`)
        edit_side_group.setVisible(false)
        view_side_group.setVisible(true)
        //sideBox.setVisible(true)
      }
      this.build_form(edit_side_group, isAdmin, this.isEdit)
      sideBox.setVisible(true)
    })
    listBox.append(row)

  }

  clearInputs(){
        this.input_bus_number?.setText("");
        this.input_bus_type?.setText("");
        this.input_capacity?.setText("");
        this.input_chair_count?.setText("");
  }

}
