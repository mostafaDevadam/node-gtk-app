
import { Adw, GLib, Gio, Gtk } from '../index.js'
import { BookingService } from '../services/booking.service.js'
import { CustomerService } from '../services/customer.service.js'
import { TripService } from '../services/trip.service.js'
import { BOOKING_TYPE, CUSTOMER_TYPE, TRIP_TYPE } from '../types.js'
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
  submit_booking_btn: any
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

  customerId: string = ""



  //
  trips_list: TRIP_TYPE[] = []

  // services
  tripService: TripService
  customerService: CustomerService
  bookingService: BookingService
  //
  userId: string = ""

  isEdit: boolean = false

  constructor(app: any) {
    this.app = app
    //this.userId = this.app.active_user.id
    this.booking_date = new InputDateTime()
    this.tripService = new TripService()
    this.customerService = new CustomerService()
    this.bookingService = new BookingService()

  }

  async build_bookings_view() {
    this.comboRow_booking_status = new Adw.ComboRow()
    this.comboRow_payment_status = new Adw.ComboRow()
    this.comboRow_trips = new Adw.ComboRow()

    this.userId = this.app.active_user.id

    console.log("userId#:", this.userId, this.app.active_user);

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
      visible: false, // Can be toggled later via sideBox.setVisible(true)
    });

    const contentBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 12,
      marginTop: 20,
      marginBottom: 24,
      marginStart: 24,
      marginEnd: 24,
    });

    // Nest sideBox inside contentBox
    contentBox.append(sideBox);

    const scrollWin = new Gtk.ScrolledWindow({
      // Optional: scroll_win.setPolicy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
      vexpand: true, // Crucial for letting it expand and scroll inside ToolbarView
      hscrollbarPolicy: Gtk.PolicyType.NEVER,
      vscrollbarPolicy: Gtk.PolicyType.AUTOMATIC,
    });
    scrollWin.setChild(contentBox);

    const wrapper = new Adw.ToolbarView();
    wrapper.setContent(scrollWin);

    // Attach to your application's window layout target
    this.app.right_sidebar.append(wrapper);


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

    this.submit_btn_cust.on("activated", async () => {

      
      if (this.isEdit && this.selectedBooking?.customer) {
        // update customer
        const obj: CUSTOMER_TYPE = {
          id: this.selectedBooking?.customer.id,
          name: this.input_cust_name.getText() ?? this.selectedBooking?.customer.name,
          phone: this.input_phone.getText() ?? this.selectedBooking?.customer.phone,
          email: this.input_email.getText() ?? this.selectedBooking?.customer.email,
          address: this.input_address.getText() ?? this.selectedBooking?.customer.address,
          created_at: this.selectedBooking?.customer.created_at
        }
        console.log("this.submit_btn_cust edit:", obj)

        console.log("edit customer")
        obj.id = this.selectedBooking.customer.id
        const result = await this.customerService.update(obj.id!!, obj)
        if(!result){
            this.app.showToast("cannot update customer")
            return
        }
        this.app.showToast("updated customer successfully!")



      } else {
        // create customer
        const obj: CUSTOMER_TYPE = {
          name: this.input_cust_name.getText(),
          phone: this.input_phone.getText(),
          email: this.input_email.getText(),
          address: this.input_address.getText(),
        }
        const customer = await this.customerService.create(obj)
        console.log("new-customer:", customer);
        if (!customer) {
          this.app.showToast("phone is already existing!")
          return
        }
        this.app.showToast("created a new customer successfully!")
        //
        this.customerId = customer.id!!

        console.log("userId:", this.userId, this.app.active_user);

      }


      //





    })


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
      this.comboRow_trips.setTitle('Trip');
      this.comboRow_trips.setSubtitle('Select trip');
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
    this.submit_booking_btn = new Adw.ActionRow({
      title: "save",
      halign: Gtk.Align.CENTER,
      activatable: true,
    })
    side_group_booking.add(this.submit_booking_btn)


    this.submit_booking_btn.on("activated", async () => {





      if (this.isEdit && this.selectedBooking) {

        const obj: BOOKING_TYPE = {
          id: this.selectedBooking.id,
          customer_id: this.selectedBooking.customer_id,
          user_id: this.userId ?? this.selectedBooking.user_id,
          trip_id: this.selectedTripId ?? this.selectedBooking.trip_id,
          booking_date: this.booking_date.input_time ?? this.selectedBooking.booking_date,
          price: this.input_price.getText() ?? this.selectedBooking.price,
          seat_number: this.input_seat_number.getText() ?? this.selectedBooking.seat_number,
          payment_status: this.currentPaymentStatusValue ?? this.selectedBooking.payment_status,
          status: this.currentBookingStatusValue ?? this.selectedBooking.status,
          created_at: this.selectedBooking.created_at,
          updated_at: "",
          booking_number: this.selectedBooking.booking_number
        }
        console.log("this.submit_booking_btn edit booking:", obj)






        console.log("edit booking")
        const result = this.bookingService.update(obj.id!!, obj)
        if (!result) {
          this.app.showToast("Cannot Update booking!")
          return
        }

        this.app.showToast("Updated booking successfully!")




      } else {
        // create booking

        if (!this.customerId || !this.userId) {
          console.log("Cannot create booking because no customerId or userId")
          return
        }

        const obj: BOOKING_TYPE = {
          customer_id: this.customerId,
          user_id: this.userId,
          trip_id: this.selectedTripId,
          booking_date: this.booking_date.input_time,
          price: this.input_price.getText(),
          seat_number: this.input_seat_number.getText(),
          payment_status: this.currentPaymentStatusValue,
          status: this.currentBookingStatusValue,
          created_at: "",
          updated_at: ""
        }

        console.log("this.submit_booking_btn create booking:", obj)

        const result = await this.bookingService.create(obj)
        console.log("success created a new booking:", result)

        //
        if (!result) {
          this.app.showToast("Cannot create a new booking!")
          return
        }

        this.app.showToast("Created a new booking successfully!")

      }





    })





    //
    const add_btn = new Gtk.Button({
      label: "Add",
      halign: Gtk.Align.END,

    })
    box.append(add_btn)
    add_btn.connect("clicked", () => {
      //this.app.clear_right_sidebar()
      this.isEdit = false
      this.clearInputs()
      side_title.setText("Add Booking")
      sideBox.setVisible(true)
      sideBox.queueResize()


    })

    const group = new Adw.PreferencesGroup()
    const listBox = new Gtk.ListBox()
    group.add(listBox)
    box.append(group)

    /*for (let item of [1, 2, 3]) {
      this.build_card(item, side_title, sideBox, listBox)
    }*/

    const list = await this.bookingService.getAll()

    for (let item of list) {
      this.build_card(item, side_title, sideBox, listBox)
    }

    this.app.template_view.build_template_view("Bookings", "home_bookngs_view", box)

  }


  build_form(parent: any) {



  }


  build_card(item: BOOKING_TYPE, side_title: any, sideBox: any, listBox: any) {
    const row = new Adw.ActionRow()
    row.setTitle(`Booking-${item.booking_number}-${item.status}`)
    row.setSubtitle(item.booking_date!!)
    row.setActivatable(true)
    const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
    row.addPrefix(icon_prefix)
    const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
    row.addSuffix(icon_suffix)
    row.connect("activated", async () => {

      this.isEdit = true
      this.selectedBooking = item



      this.selectedBooking.customer = await this.customerService.getById(item.customer_id)

      console.log("selected booking:", item, this.selectedBooking)



      side_title.setText(`Edit booking ${item.booking_number}`)
      this.clearInputs()

      if (this.selectedBooking && this.isEdit) {
        // customer
        if (this.selectedBooking.customer) {
          this.input_cust_name.setText(this.selectedBooking.customer.name ?? "");
          this.input_phone.setText(this.selectedBooking.customer.phone ?? "");
          this.input_email.setText(this.selectedBooking.customer.email ?? "");
          this.input_address.setText(this.selectedBooking.customer.address ?? "");

        }


        // booking

        this.input_seat_number.setText(this.selectedBooking.seat_number ?? "");
        this.input_price.setText(this.selectedBooking.price ?? "");

        this.booking_date.setDefaultValue(this.selectedBooking.booking_date!!)

        const l1 = this.trips_list.findIndex(fl => fl.id == item.trip_id)
        this.comboRow_trips.setSelected(l1);

        const k1 = this.booking_status_list.findIndex(fl => fl == item.status)
        this.comboRow_booking_status.setSelected(k1)

        const p1 = this.payment_status_list.findIndex(fl => fl == item.payment_status)
        this.comboRow_payment_status.setSelected(p1)





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