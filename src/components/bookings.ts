
import { Adw, GLib, Gio, Gtk } from '../index.js'
import { BookingService } from '../services/booking.service.js'
import { CustomerService } from '../services/customer.service.js'
import { TripService } from '../services/trip.service.js'
import { BOOKING_TYPE, TRIP_TYPE } from '../types.js'
import { InputDateTime } from './forms/input-date-time.js'


export class BookingsComponent {

  app: any
  selectedBooking: BOOKING_TYPE | null = null
  input_cust_name: any
  input_phone: any
  input_email: any
  input_address: any
  submit_btn_cust: any
  input_seat_number: any
  //input_booking_date: any
  booking_date: InputDateTime
  input_status: any
  input_price: any
  //input_payment_status: any
  submit_btn: any
  // booking-status
  comboRow_booking_status: any
  booking_status_list: string[] = ['pending', 'waiting', 'processing', 'finished']
  display_booking_status: string[] = []
  currentBookingStatusValue: string = ""

  // payment-status
  comboRow_payment_status: any
  payment_status_list: string[] = ['pending', 'waiting', 'processing', 'finished']
  display_payment_status: string[] = []
  currentPaymentStatusValue: string = ""

  // trips
  comboRow_trips: any
  display_trips: string[] = []

  selectedTripId: string = ""



  //
  trips_list: TRIP_TYPE[] = []

  // services
  tripService: TripService
  customerService: CustomerService
  bookingService: BookingService
  //

  constructor(app: any) {
    this.app = app
    this.booking_date = new InputDateTime()
    this.tripService = new TripService()
    this.customerService = new CustomerService()
    this.bookingService = new BookingService()

  }

  async build_bookings_view() {
    this.comboRow_booking_status = new Adw.ComboRow()
    this.comboRow_payment_status = new Adw.ComboRow()
    this.comboRow_trips = new Adw.ComboRow()

    const box = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 10,
      marginBottom: 12,
      marginStart: 12,
      marginEnd: 12,


    })
    box.setSizeRequest(240, -1)
    //const lbl = new Gtk.Label({label: "bookings#"})
    //box.append(lbl)

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
    const side_group = new Adw.PreferencesGroup()
    sideBox.append(side_group)
    // inputs
    //this.build_form(side_group)
    const side_group_customer = new Adw.PreferencesGroup()
    side_group_customer.setTitle("Customer")
    side_group.add(side_group_customer)
    // seat_number 
    this.input_cust_name = new Adw.EntryRow({
      title: "Customer Name",
      inputPurpose: Gtk.InputPurpose.NAME,
    })
    side_group_customer.add(this.input_cust_name)

    this.input_phone = new Adw.EntryRow({
      title: "Phone",
      inputPurpose: Gtk.InputPurpose.PHONE,
    })
    side_group_customer.add(this.input_phone)


    this.input_email = new Adw.EntryRow({
      title: "Email",
      inputPurpose: Gtk.InputPurpose.EMAIL,
    })
    side_group_customer.add(this.input_email)

    this.input_address = new Adw.EntryRow({
      title: "Address",
      inputPurpose: Gtk.InputPurpose.NAME,
    })
    side_group_customer.add(this.input_address)


    // submit_btn
    this.submit_btn_cust = new Adw.ActionRow({
      title: "save",
      halign: Gtk.Align.CENTER,
      activatable: true,
    })
    side_group_customer.add(this.submit_btn_cust)


    // booking-form
    const side_group_booking = new Adw.PreferencesGroup()
    side_group_booking.setTitle("Booking")
    side_group.add(side_group_booking)

    // dropdown-list for trips
    this.trips_list = await this.tripService.getAll()
    // Handle fallback if database returns an empty payload array
    if (this.trips_list && this.trips_list.length > 0) {

      // Set fallback baseline ID
      this.selectedTripId = this.trips_list[0].id!!;

      // 2. Extract only the human-readable 'name' strings for the visual model
      this.display_trips = this.trips_list.map(m => m.destination!!.toString());
      const stringList = Gtk.StringList.new(this.display_trips);

      // 3. Initialize your Dropdown Row
      //const comboRow = new Adw.ComboRow();
      this.comboRow_trips.setTitle('Bus');
      this.comboRow_trips.setSubtitle('Select bus');
      this.comboRow_trips.setModel(stringList);
      side_group_booking.add(this.comboRow_trips);

      // 4. Update the internal component state whenever the user alters the selection
      /* comboRow.on('notify::selected', () => {
         const selectedIndex = comboRow.getSelected();
         if (selectedIndex >= 0 && selectedIndex < bus_list.length) {
           this.selectedBusId = bus_list[selectedIndex].id!!;
           console.log(`State updated! Current selectedBusId: ${this.selectedBusId}`);
         }
       });*/

      // 4. Safely pull data on change using the native index
      this.comboRow_trips.on('notify::selected', () => {
        const selectedIndex = this.comboRow_trips.getSelected();

        // Bounds check protection 
        if (selectedIndex >= 0 && selectedIndex < this.trips_list.length) {
          const selectedData = this.trips_list[selectedIndex];

          // Zero type errors, direct structural access
          console.log(`Saved Database ID: ${selectedData.id}`);
          console.log(`Display Text Value: ${selectedData.destination}`);

          this.selectedTripId = selectedData.id!!
        }
      });

      //console.log("---------------------------this.selected_trip:", this.selected_trip);

      // 5. Look up the index match 
      /*if (this.selected_trip) {
        const defaultIndex = this.bus_list.findIndex(item => item.id === this.selected_trip?.bus_id);
        console.log("---------------------------defaultIndex:", defaultIndex);

        if (defaultIndex !== -1) {
          
        }
      }*/
    }








    // seat_number 
    this.input_seat_number = new Adw.EntryRow({
      title: "Seat Number",
      inputPurpose: Gtk.InputPurpose.NUMBER,
    })
    side_group_booking.add(this.input_seat_number)


    // booking_date 
    this.booking_date.build(side_group_booking, "Booking Time", this.booking_date)


    // status: booking_status 
    side_group_booking.add(this.comboRow_booking_status)
    const stringList1 = Gtk.StringList.new(this.booking_status_list);

    this.currentBookingStatusValue = this.booking_status_list[0]

    this.comboRow_booking_status.setTitle('Booking Status');
    this.comboRow_booking_status.setSubtitle('Select booking status');
    this.comboRow_booking_status.setModel(stringList1); // Map the data model to the Adw row


    // 3. Optional: Enable search filter tracking within the row overlay popup
    this.comboRow_booking_status.setEnableSearch(true);

    // 4. Capture selection updates using property notification signatures
    this.comboRow_booking_status.on('notify::selected', () => {
      const selectedIndex = this.comboRow_booking_status.getSelected();

      // Extract the StringObject wrapper safely
      const selectedItem = this.comboRow_booking_status.getSelectedItem()!!

      if (selectedItem) {
        // Assert the generic object as a Gtk.StringObject
        const stringObj = selectedItem as any
        const stringValue = stringObj.getString();

        console.log(`User picked item #${selectedIndex}: "${stringValue}"`);

        this.currentBookingStatusValue = stringValue

      }
    });


    // price 
    this.input_price = new Adw.EntryRow({
      title: "Price",
      inputPurpose: Gtk.InputPurpose.NAME,
    })
    side_group_booking.add(this.input_price)

    // payment_status 
    side_group_booking.add(this.comboRow_payment_status)
    const stringList2 = Gtk.StringList.new(this.payment_status_list);

    this.currentPaymentStatusValue = this.payment_status_list[0]

    this.comboRow_payment_status.setTitle('Payment Status');
    this.comboRow_payment_status.setSubtitle('Select payment status');
    this.comboRow_payment_status.setModel(stringList2); // Map the data model to the Adw row


    // 3. Optional: Enable search filter tracking within the row overlay popup
    this.comboRow_payment_status.setEnableSearch(true);

    // 4. Capture selection updates using property notification signatures
    this.comboRow_payment_status.on('notify::selected', () => {
      const selectedIndex = this.comboRow_payment_status.getSelected();

      // Extract the StringObject wrapper safely
      const selectedItem = this.comboRow_payment_status.getSelectedItem()!!

      if (selectedItem) {
        // Assert the generic object as a Gtk.StringObject
        const stringObj = selectedItem as any
        const stringValue = stringObj.getString();

        console.log(`User picked item #${selectedIndex}: "${stringValue}"`);

        this.currentPaymentStatusValue = stringValue

      }
    });






    // 
    // submit_btn
    this.submit_btn = new Adw.ActionRow({
      title: "save",
      halign: Gtk.Align.CENTER,
      activatable: true,
    })
    side_group_booking.add(this.submit_btn)





    //
    const add_btn = new Gtk.Button({
      label: "Add",
      halign: Gtk.Align.END,

    })
    box.append(add_btn)
    add_btn.connect("clicked", () => {
      //this.app.clear_right_sidebar()
      this.clearInputs()
      side_title.setText("Add Booking")
      sideBox.setVisible(true)


    })

    const group = new Adw.PreferencesGroup()
    const listBox = new Gtk.ListBox()
    group.add(listBox)
    box.append(group)

    for (let item of [1, 2, 3]) {
      this.build_card(item, side_title, sideBox, listBox)
    }

    this.app.template_view.build_template_view("Bookings", "home_bookngs_view", box)

  }


  build_form(parent: any) {


    /*
    trip_id (FK)
   customer_id(FK)
   user_id (FK)
   seat_number
   booking_date
   status
   price
   payment_status
    */

    // customer-form



    /*
    name
    phone (unique) 
    email
    address
    */
    // seat_number 






    // 
    // submit_btn


  }


  build_card(item: any, side_title: any, sideBox: any, listBox: any) {
    const row = new Adw.ActionRow()
    row.setTitle(`Booking-${item}`)
    row.setActivatable(true)
    const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
    row.addPrefix(icon_prefix)
    const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
    row.addSuffix(icon_suffix)
    row.connect("activated", () => {
      side_title.setText(`Edit booking ${item}`)
      this.clearInputs()

      if (this.selectedBooking) {
        // customer
        //this.input_cust_name.setText(this.selectedBooking.customer.name ?? "");
        /*this.input_phone.setText("");
        this.input_email.setText("");
        this.input_address.setText("");

        // booking

        this.input_seat_number.setText(this.selectedBooking.seat_number ?? "");
        this.input_price.setText(this.selectedBooking.price ?? "");

        this.booking_date.setDefaultValue(this.selectedBooking.booking_date!!)*/
        //const l1 = this.trips_list.findIndex(fl => fl.id == item.)
        //this.comboRow_trips.setSelected(l1);


      }
      sideBox.setVisible(true)
    })
    listBox.append(row)

  }

  clearInputs() {


    this.input_cust_name.setText("");
    this.input_phone.setText("");
    this.input_email.setText("");
    this.input_address.setText("");

    this.input_seat_number.setText("");
    this.input_price.setText("");

    this.booking_date.setDefaultValue("")

    this.comboRow_booking_status.setSelected(0)
    this.comboRow_payment_status.setSelected(0)




  }

}