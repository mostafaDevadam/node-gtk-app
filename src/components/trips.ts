
import { UserRole } from '../enums.js';
import { Adw, GLib, Gio, Gtk } from '../index.js'
import { BusService } from '../services/bus.service.js';
import { TripService } from '../services/trip.service.js';
import { BUS, TRIP_TYPE } from '../types.js';
import { InputDateTime } from './forms/input-date-time.js';
import { InputDate } from './forms/input-date.js';


const dropDownList = async (parent: any, value: string) => {
  // dropdown-list bus
  // 1. Create a Gtk.StringList model for your items
  const options = ['JavaScript', 'TypeScript', 'Python', 'C++'];
  const stringList = Gtk.StringList.new(options);

  let selected = ""

  // 2. Instantiate the ComboRow
  const comboRow = new Adw.ComboRow();
  parent.add(comboRow)
  comboRow.setTitle('Primary Language');
  comboRow.setSubtitle('Select your favorite stack');
  comboRow.setModel(stringList); // Map the data model to the Adw row

  // 3. Optional: Enable search filter tracking within the row overlay popup
  comboRow.setEnableSearch(true);

  // 4. Capture selection updates using property notification signatures
  comboRow.on('notify::selected', () => {
    const selectedIndex = comboRow.getSelected();

    // Extract the StringObject wrapper safely
    const selectedItem = comboRow.getSelectedItem()!!



    if (selectedItem) {
      // Assert the generic object as a Gtk.StringObject
      const stringObj = selectedItem as any
      const stringValue = stringObj.getString();
      value = stringValue

      console.log(`User picked item #${selectedIndex}: "${stringValue}"`);

      selected = stringValue

    }
  });

  return selected



}



interface StatusOption {
  id: string;
  name: string;
}

// 1. Rewrite the helper function to return a Promise wrapping your structure
const dropDownList2 = (parent: any, currentIdValue: string): Promise<string> => {
  return new Promise((resolve) => {
    // Structured array containing your backend tracking IDs and UI display names
    const options: StatusOption[] = [
      { id: 'online', name: 'Online' },
      { id: 'away', name: 'Away' },
      { id: 'busy', name: 'Do Not Disturb' },
      { id: 'offline', name: 'Invisible' }
    ];

    const displayNames = options.map(opt => opt.name);
    const stringList = Gtk.StringList.new(displayNames);

    const comboRow = new Adw.ComboRow();
    comboRow.setTitle('Current Status');
    comboRow.setSubtitle('Select your visibility');
    comboRow.setEnableSearch(false);
    comboRow.setModel(stringList);

    parent.add(comboRow);

    // Dynamic pre-selection matching the incoming value string
    const initialIndex = options.findIndex(opt => opt.id === currentIdValue);
    if (initialIndex !== -1) {
      comboRow.setSelected(initialIndex);
    }

    // Capture selections asynchronously
    comboRow.on('notify::selected', () => {
      const selectedIndex = comboRow.getSelected();

      if (selectedIndex >= 0 && selectedIndex < options.length) {
        const choice = options[selectedIndex];

        console.log(`Dropdown updated state internally to: ${choice.id}`);

        // Resolve the promise passing the backend string ID upward
        resolve(choice.id);
      }
    });
  });
};



const b_dropdown = (edit_side_group: any, selectedBusId: any) => {
  // 1. Define your typed array of structured objects
  interface LanguageOption {
    id: string;
    name: string;
  }

  const languages: LanguageOption[] = [
    { id: '1', name: 'JavaScript (Node.js)' },
    { id: '2', name: 'TypeScript (Deno)' },
    { id: '3', name: 'Python (PyGObject)' },
    { id: '4', name: 'Native C++' }
  ];

  // 2. Extract only the human-readable 'name' strings for the visual model
  const displayNames = languages.map(lang => lang.name);
  const stringList = Gtk.StringList.new(displayNames);

  // 3. Initialize your Dropdown Row
  const comboRow = new Adw.ComboRow();
  edit_side_group.add(comboRow)
  comboRow.setTitle('Preferred Runtime');
  comboRow.setModel(stringList);

  // 4. Safely pull data on change using the native index
  comboRow.on('notify::selected', () => {
    const selectedIndex = comboRow.getSelected();

    // Bounds check protection 
    if (selectedIndex >= 0 && selectedIndex < languages.length) {
      const selectedData = languages[selectedIndex];

      // Zero type errors, direct structural access
      console.log(`Saved Database ID: ${selectedData.id}`);
      console.log(`Display Text Value: ${selectedData.name}`);

      selectedBusId = selectedData.id
    }
  });
}
export class TripsComponent {

  app: any
  arrival_time: InputDateTime
  departure_time: InputDateTime
  input_departure: any
  input_destination: any
  input_status: any
  input_available_seats: any
  submit_btn: any
  isEdit: boolean = false
  selected_trip: TRIP_TYPE | null = null
  trip_service: TripService
  bus_service: BusService
  selectedBusId: string = ""
  currentStatusValue: string = ""

  

  constructor(app: any) {
    this.app = app
    this.arrival_time = new InputDateTime()
    this.departure_time = new InputDateTime()
    this.trip_service = new TripService()
    this.bus_service = new BusService()
  }

  async build_trips_view() {
    const isAdmin = this.app.active_user_role === UserRole.admin || this.app.active_user_role === "admin";


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




    const bus_list: BUS[] = await this.bus_service.getAll()

    //console.log("bus_list:", bus_list)

    this.selectedBusId = bus_list[0].id!!


    // Handle fallback if database returns an empty payload array
    if (bus_list && bus_list.length > 0) {

      // Set fallback baseline ID
      this.selectedBusId = bus_list[0].id!!;

      // 2. Extract only the human-readable 'name' strings for the visual model
      const displayNames = bus_list.map(m => m.bus_number!!.toString());
      const stringList = Gtk.StringList.new(displayNames);

      // 3. Initialize your Dropdown Row
      const comboRow = new Adw.ComboRow();
      comboRow.setTitle('Select Bus'); // Fixed title context
      comboRow.setModel(stringList);
      edit_side_group.add(comboRow);

      // 4. Update the internal component state whenever the user alters the selection
     /* comboRow.on('notify::selected', () => {
        const selectedIndex = comboRow.getSelected();
        if (selectedIndex >= 0 && selectedIndex < bus_list.length) {
          this.selectedBusId = bus_list[selectedIndex].id!!;
          console.log(`State updated! Current selectedBusId: ${this.selectedBusId}`);
        }
      });*/

      // 4. Safely pull data on change using the native index
      comboRow.on('notify::selected', () => {
        const selectedIndex = comboRow.getSelected();

        // Bounds check protection 
        if (selectedIndex >= 0 && selectedIndex < bus_list.length) {
          const selectedData = bus_list[selectedIndex];

          // Zero type errors, direct structural access
          console.log(`Saved Database ID: ${selectedData.id}`);
          console.log(`Display Text Value: ${selectedData.bus_number}`);

          this.selectedBusId = selectedData.id!!
        }
      });

      console.log("---------------------------this.selected_trip:", this.selected_trip);

      // 5. Look up the index match 
      if (this.selected_trip) {
        const defaultIndex = bus_list.findIndex(item => item.id === this.selected_trip?.bus_id);
        console.log("---------------------------defaultIndex:", defaultIndex);

        if (defaultIndex !== -1) {
          // CRITICAL FIX: Push the selection code to the next GLib main loop tick.
          // This prevents GTK from dropping the selection value during layout init.
          GLib.timeoutAdd(GLib.PRIORITY_DEFAULT, 1, () => {
            comboRow.setSelected(defaultIndex);
            // Also align your internal state variable instantly
            this.selectedBusId = bus_list[defaultIndex].id!!;
            return GLib.SOURCE_REMOVE; // Tells GLib not to repeat this callback loop
          });
        }
      }
    }






    // dropdown-list status
    //this.currentStatusValue = await dropDownList(edit_side_group, this.currentStatusValue);
    // 1. Create a Gtk.StringList model for your items
    const options = ['pending', 'waiting', 'processing', 'finished'];
    const stringList2 = Gtk.StringList.new(options);

    this.currentStatusValue = options[0]



    // 2. Instantiate the ComboRow
    const comboRow2 = new Adw.ComboRow();
    edit_side_group.add(comboRow2)
    comboRow2.setTitle('Primary Language');
    comboRow2.setSubtitle('Select your favorite stack');
    comboRow2.setModel(stringList2); // Map the data model to the Adw row
    //comboRow2.setData("waiting", "waiting")


    // 3. Optional: Enable search filter tracking within the row overlay popup
    comboRow2.setEnableSearch(true);

    // 4. Capture selection updates using property notification signatures
    comboRow2.on('notify::selected', () => {
      const selectedIndex = comboRow2.getSelected();

      // Extract the StringObject wrapper safely
      const selectedItem = comboRow2.getSelectedItem()!!

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

    this.input_status = new Adw.EntryRow({
      title: "Status",
      inputPurpose: Gtk.InputPurpose.NAME,
    })
    edit_side_group.add(this.input_status)

    this.input_available_seats = new Adw.EntryRow({
      title: "Available Seats",
      inputPurpose: Gtk.InputPurpose.NUMBER,
    })
    edit_side_group.add(this.input_available_seats)

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
          //obj.id = this.selected_trip?.id
          console.log("submit_btn trip edit:", obj, this.selected_trip)
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

      this.input_status.setEditable(isAdmin);
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
          this.input_status?.setText(this.selected_trip.status?.toString() ?? "");
          this.input_available_seats?.setText(this.selected_trip.available_seats?.toString() ?? "");
          this.input_departure?.setText(this.selected_trip.departure?.toString() ?? "");
          this.input_destination?.setText(this.selected_trip.destination?.toString() ?? "");
          //bus_id
          //departure_time
          //arrival_time

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
    this.input_status?.setText("");
    this.input_available_seats?.setText("");
    this.input_departure?.setText("");
    this.input_destination?.setText("");
  }


}