
import { UserRole } from '../enums.js';
import { Adw, GLib, Gio, Gtk } from '../index.js'
import { BusService } from '../services/bus.service.js';
import { TripService } from '../services/trip.service.js';
import { BUS, TRIP_TYPE } from '../types.js';
import { InputDateTime } from './forms/input-date-time.js';
import { InputDate } from './forms/input-date.js';



export class TripsComponent {

  app: any
  arrival_time: InputDateTime
  departure_time: InputDateTime
  input_departure: any
  input_destination: any

  input_available_seats: any
  submit_btn: any
  isEdit: boolean = false
  selected_trip: TRIP_TYPE | null = null
  trip_service: TripService
  bus_service: BusService
  selectedBusId: string = ""
  selectedBus: BUS | null = null
  currentStatusValue: string = ""
  bus_list: BUS[] = [];
  comboRow_bus: any
  displayNames: string[] = []
  comboRow_status: any
  status_list: string[] = ['pending', 'waiting', 'processing', 'finished']


  constructor(app: any) {
    this.app = app
    this.arrival_time = new InputDateTime()
    this.departure_time = new InputDateTime()
    this.trip_service = new TripService()
    this.bus_service = new BusService()

  }

  async build_trips_view() {
    const isAdmin = this.app.active_user_role === UserRole.admin || this.app.active_user_role === "admin";

    this.comboRow_bus = new Adw.ComboRow();
    this.comboRow_status = new Adw.ComboRow()


    const box = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,


    })
    box.setSizeRequest(240, -1)
    //const lbl = new Gtk.Label({label: "Trips#"})
    //box.append(lbl)

    // list for both


    // item click -> admin: display form in right_sidebar else display just info

    // in right_sidebar
    const sideBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
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
    //this.build_form(edit_side_group, isAdmin)

    // dropdown-list bus


    // 1. Define your typed array of structured objects

    this.input_available_seats = new Adw.EntryRow({
      title: "Available Seats",
      inputPurpose: Gtk.InputPurpose.NUMBER,
    })




    this.bus_list = await this.bus_service.getAll()

    //console.log("bus_list:", bus_list)

    this.selectedBusId = this.bus_list[0].id!!


    // Handle fallback if database returns an empty payload array
    if (this.bus_list && this.bus_list.length > 0) {

      // Set fallback baseline ID
      this.selectedBusId = this.bus_list[0].id!!;
      this.selectedBus = this.bus_list[0]

      // 2. Extract only the human-readable 'name' strings for the visual model
      this.displayNames = this.bus_list.map(m => m.bus_number!!.toString());
      const stringList = Gtk.StringList.new(this.displayNames);

      // 3. Initialize your Dropdown Row
      //const comboRow = new Adw.ComboRow();
      this.comboRow_bus.setTitle('Bus');
      this.comboRow_bus.setSubtitle('Select bus');
      this.comboRow_bus.setModel(stringList);
      edit_side_group.add(this.comboRow_bus);

      // 4. Update the internal component state whenever the user alters the selection
      /* comboRow.on('notify::selected', () => {
         const selectedIndex = comboRow.getSelected();
         if (selectedIndex >= 0 && selectedIndex < bus_list.length) {
           this.selectedBusId = bus_list[selectedIndex].id!!;
           console.log(`State updated! Current selectedBusId: ${this.selectedBusId}`);
         }
       });*/

      // 4. Safely pull data on change using the native index
      this.comboRow_bus.on('notify::selected', () => {
        const selectedIndex = this.comboRow_bus.getSelected();

        // Bounds check protection 
        if (selectedIndex >= 0 && selectedIndex < this.bus_list.length) {
          const selectedData = this.bus_list[selectedIndex];
           this.selectedBus = selectedData

          // Zero type errors, direct structural access
          console.log(`Saved Database ID: ${selectedData.id}`);
          console.log(`Display Text Value: ${selectedData.bus_number}`);

          this.selectedBusId = selectedData.id!!
        }
      });

      console.log("---------------------------this.selected_trip:", this.selected_trip);

      // 5. Look up the index match 
      if (this.selected_trip) {
        const defaultIndex = this.bus_list.findIndex(item => item.id === this.selected_trip?.bus_id);
        console.log("---------------------------defaultIndex:", defaultIndex);

        if (defaultIndex !== -1) {
          // CRITICAL FIX: Push the selection code to the next GLib main loop tick.
          // This prevents GTK from dropping the selection value during layout init.
          /* GLib.timeoutAdd(GLib.PRIORITY_DEFAULT, 1, () => {
             this.comboRow.setSelected(defaultIndex);
             // Also align your internal state variable instantly
             this.selectedBusId = this.bus_list[defaultIndex].id!!;
             return GLib.SOURCE_REMOVE; // Tells GLib not to repeat this callback loop
           });*/
        }
      }
    }






    // dropdown-list status
    //this.currentStatusValue = await dropDownList(edit_side_group, this.currentStatusValue);
    // 1. Create a Gtk.StringList model for your items
    //const options = ['pending', 'waiting', 'processing', 'finished'];
    const stringList2 = Gtk.StringList.new(this.status_list);

    this.currentStatusValue = this.status_list[0]



    // 2. Instantiate the ComboRow
    //const comboRow2 = new Adw.ComboRow();
    edit_side_group.add(this.comboRow_status)
    this.comboRow_status.setTitle('Status');
    this.comboRow_status.setSubtitle('Select status');
    this.comboRow_status.setModel(stringList2); // Map the data model to the Adw row
    //comboRow2.setData("waiting", "waiting")


    // 3. Optional: Enable search filter tracking within the row overlay popup
    this.comboRow_status.setEnableSearch(true);

    // 4. Capture selection updates using property notification signatures
    this.comboRow_status.on('notify::selected', () => {
      const selectedIndex = this.comboRow_status.getSelected();

      // Extract the StringObject wrapper safely
      const selectedItem = this.comboRow_status.getSelectedItem()!!

      if (selectedItem) {
        // Assert the generic object as a Gtk.StringObject
        const stringObj = selectedItem as any
        const stringValue = stringObj.getString();


        console.log(`User picked item #${selectedIndex}: "${stringValue}"`);

        this.currentStatusValue = stringValue

      }
    });



    //departure_time
    this.departure_time.build(edit_side_group, "Departure Time", this.departure_time)

    //arrival_time
    this.arrival_time.build(edit_side_group, "Arrival Time", this.arrival_time)


    this.input_departure = new Adw.EntryRow({
      title: "Departure",
      inputPurpose: Gtk.InputPurpose.NAME,
    })
    edit_side_group.add(this.input_departure)


    this.input_destination = new Adw.EntryRow({
      title: "Destination",
      inputPurpose: Gtk.InputPurpose.NAME,
    })
    edit_side_group.add(this.input_destination)


    //available_seats
     this.input_available_seats.connect("notify::text", () => {
      const textVal = this.input_available_seats.getText();
      const val = parseInt(textVal);

      // If the input is empty or NaN, let the user type freely
      if (isNaN(val)) return;

      if (this.selectedBus) {
        const chair_count = this.selectedBus?.chair_count ?? 0

        // Fixed comparison: error only if user types MORE than available seats
        if (val > chair_count) {
          console.log("error! : max is ", chair_count, ", available_seats:", val);

          // Prevent recursive loop by checking if text is already set to max
          const maxStr = chair_count.toString();
          if (textVal !== maxStr) {
            this.input_available_seats.setText(maxStr);
          }
        } else {
          console.log({ chair_count, seat_number: val });
        }

      } else {
        console.log("no selectedTrip");
      }
    });

    
    edit_side_group.add(this.input_available_seats)


    // submit_btn

    this.submit_btn = new Adw.ActionRow({
      title: "save",
      halign: Gtk.Align.CENTER,
      activatable: true,
      visible: isAdmin,
    })
    edit_side_group.add(this.submit_btn)

    this.submit_btn.on("activated", () => {
      console.log("this.currentStatusValue:", this.currentStatusValue)

      if (isAdmin) {
        const obj: TRIP_TYPE = {
          id: "",
          bus_id: "",
          arrival_time: this.arrival_time.input_time,
          departure_time: this.departure_time.input_time,
          available_seats: this.input_available_seats.getText(),
          departure: this.input_departure.getText(),
          destination: this.input_destination.getText(),
          status: this.currentStatusValue,
          created_at: "",
          updated_at: ""

        }


        if (this.isEdit && this.selected_trip) {
          obj.id = this.selected_trip?.id
          obj.bus_id = this.selectedBusId ?? this.selected_trip.bus_id
          obj.created_at = this.selected_trip.created_at
          obj.arrival_time = this.arrival_time.input_time ?? this.selected_trip.arrival_time
          obj.departure_time = this.departure_time.input_time ?? this.selected_trip.departure_time



          console.log("submit_btn trip edit:", obj, this.selected_trip)
          this.trip_service.update(obj.id!!, obj)
        } else {
          obj.bus_id = this.selectedBusId
          console.log("submit_btn trip create: ", obj)
          this.trip_service.create(obj)
        }

      }

    })

    // 
    const view_side_group = new Adw.PreferencesGroup({ visible: false })
    sideBox.append(view_side_group)
    this.build_details(view_side_group)




    if (isAdmin) {
      const add_btn = new Gtk.Button({
        label: "Add",
        halign: Gtk.Align.END

      })
      box.append(add_btn)
      add_btn.connect("clicked", () => {
        this.selected_trip = null
        this.isEdit = false
        this.clearInputs()
        side_title.setText("Add Trip")
        edit_side_group.setVisible(true)
        sideBox.setVisible(true)

      })
    }


    //

    const group = new Adw.PreferencesGroup()
    const listBox = new Gtk.ListBox()
    group.add(listBox)
    box.append(group)

    /*for (let item of [1, 2, 3]) {
      this.build_card(item, side_title, sideBox, listBox, edit_side_group, view_side_group, isAdmin)

    }*/
    const list = await this.trip_service.getAll()

    for (let item of list) {
      this.build_card(item, side_title, sideBox, listBox, edit_side_group, view_side_group, isAdmin)
    }

    this.app.template_view.build_template_view("Trips", "home_trips_view", box)

  }

  build_form(parent: any, isAdmin: boolean) {

    /*
    bus_id (FK) 
    departure
    destination
    departure_time
    arrival_time
    status
    available_seats
    */

    // dropdwon-list for buses


    let child = parent.getFirstChild()
    while (child != null) {
      let next = child.getNextSibling()
      parent.remove(child)
      child = next
    }

    parent.setVisible(true)

    if (isAdmin) {


      this.input_available_seats.setEditable(isAdmin);
      this.input_departure.setEditable(isAdmin);
      this.input_destination.setEditable(isAdmin);

    }





  }

  build_details(parent: any) {

    const view_row = new Adw.ActionRow()
    parent.add(view_row)
    view_row.setTitle(`Trip-lorem`)
    view_row.setSubtitle("Lorem lorem lorem")
    const view_row1 = new Adw.ActionRow()
    parent.add(view_row1)
    view_row1.setTitle(`Trip-lorem 1`)
    view_row1.setSubtitle("Lorem lorem lorem")
    const view_row2 = new Adw.ActionRow()
    parent.add(view_row2)
    view_row2.setTitle(`Trip-lorem 2`)
    view_row2.setSubtitle("Lorem lorem lorem")

  }

  build_card(item: TRIP_TYPE, side_title: any, sideBox: any, listBox: any, edit_side_group: any, view_side_group: any, isAdmin: boolean) {
    const row = new Adw.ActionRow()
    row.setTitle(`Trip-${item.destination}`)
    row.setSubtitle(`Available Seats: ${item.available_seats}`)
    row.setActivatable(true)
    const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
    row.addPrefix(icon_prefix)
    const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
    row.addSuffix(icon_suffix)
    row.connect("activated", () => {
      //this.app.clear_right_sidebar()
      this.selected_trip = item
      if (isAdmin) {
        this.isEdit = true
        side_title.setText(`Edit Trip ${item.destination} - ${item.status}`)
        edit_side_group.setVisible(true)
        view_side_group.setVisible(false)
        //sideBox.setVisible(true)
        if (this.selected_trip) {

          this.input_available_seats?.setText(this.selected_trip.available_seats?.toString() ?? "");
          this.input_departure?.setText(this.selected_trip.departure?.toString() ?? "");
          this.input_destination?.setText(this.selected_trip.destination?.toString() ?? "");
          //bus_id
          //departure_time
          //arrival_time
          const l1 = this.bus_list.findIndex(fl => fl.id == item.bus_id)
          //console.log("################# l1:", l1, this.bus_list[l1], this.displayNames[l1])
          this.comboRow_bus.setSelected(l1);
          this.selectedBus = this.bus_list.filter(fl => fl.id == item.bus_id)[0]
          //
          this.arrival_time.setDefaultValue(item.arrival_time!!)
          this.departure_time.setDefaultValue(item.departure_time!!)
          //
          const k1 = this.status_list.findIndex(fl => fl == item.status)
          this.comboRow_status.setSelected(k1)

        }

      } else {
        this.isEdit = false
        side_title.setText(`Trip ${item}`)
        edit_side_group.setVisible(false)
        view_side_group.setVisible(true)
        //sideBox.setVisible(true)
      }
      this.build_form(edit_side_group, isAdmin)
      sideBox.setVisible(true)
    })
    listBox.append(row)

  }


  clearInputs() {

    this.input_available_seats?.setText("");
    this.input_departure?.setText("");
    this.input_destination?.setText("");
    this.arrival_time.setDefaultValue("")
    this.departure_time.setDefaultValue("")
    this.comboRow_status.setSelected(0)
     this.comboRow_bus.setSelected(0);
  }


}