
import { UserRole } from '../enums.js';
import { Adw, GLib, Gio, Gtk } from '../index.js'
import { BookingService } from '../services/booking.service.js';
import { HistoryService } from '../services/history.service.js';
import { UserService } from '../services/user.service.js';
import { HISTORY_TYPE } from '../types.js';


export class HistoryComponent {

   app: any
   historyService: HistoryService
   history_list: HISTORY_TYPE[] = []
   selectedHistory: HISTORY_TYPE | null = null

   bookingService: BookingService
   userService: UserService

   view_row_action_type: any
   view_row_new_status: any
   view_row_prev_status: any

   view_row_user_name: any
   view_row_booking_number: any


   constructor(app: any) {
      this.app = app
      this.bookingService = new BookingService()
      this.userService = new UserService()
      this.historyService = new HistoryService(this.userService, this.bookingService)
   }

   async build_history_view() {
      const isAdmin = this.app.active_user_role === UserRole.admin || this.app.active_user_role === "admin";


      const box = new Gtk.Box({
         orientation: Gtk.Orientation.VERTICAL,
         spacing: 10,
         marginBottom: 12,
         marginStart: 12,
         marginEnd: 12,


      })
      box.setSizeRequest(240, -1)
      //const lbl = new Gtk.Label({label: "History#"})
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
      const side_title = new Gtk.Label({ label: "History" })
      sideBox.append(side_title)
      // 
      const view_side_group = new Adw.PreferencesGroup()
      sideBox.append(view_side_group)
      // 
      this.view_row_action_type = new Adw.ActionRow()
      view_side_group.add(this.view_row_action_type)
      this.view_row_action_type.setTitle(`Action Type`)

      this.view_row_new_status = new Adw.ActionRow()
      view_side_group.add(this.view_row_new_status)
      this.view_row_new_status.setTitle(`New-Status`)

      // booking-details
      const view_side_booking_group = new Adw.PreferencesGroup({ title: "Booking" })
      sideBox.append(view_side_booking_group)

      this.view_row_booking_number = new Adw.ActionRow()
      view_side_booking_group.add(this.view_row_booking_number)
      this.view_row_booking_number.setTitle(`Booking Number`)



      // user-details
      const view_side_user_group = new Adw.PreferencesGroup({ title: "User" })
      sideBox.append(view_side_user_group)

      this.view_row_user_name = new Adw.ActionRow()
      view_side_user_group.add(this.view_row_user_name)
      this.view_row_user_name.setTitle(`Name`)







      //
      const group = new Adw.PreferencesGroup()
      const listBox = new Gtk.ListBox()
      group.add(listBox)
      box.append(group)

      this.history_list = await this.historyService.getAll()
      console.log("this.history_list:", this.history_list)

      /*for(let item of [1,2,3]){
         this.build_card(item, side_title, sideBox, listBox)
      }*/

      for (let item of this.history_list) {
         this.build_card(item, side_title, sideBox, listBox)
      }

      this.app.template_view.build_template_view("History", "home_history_view", box)

   }

   build_details() {

      console.log("build_details:", this.selectedHistory)




      if (!this.selectedHistory) {
         console.log("no selected history")
         return
      } else {

         this.view_row_action_type.setSubtitle(this.selectedHistory.action_type)

         if (this.selectedHistory.new_status) {
            this.view_row_new_status.setSubtitle(this.selectedHistory.new_status)
         }

         if (this.selectedHistory.previous_status) {
            this.view_row_new_status.setSubtitle(this.selectedHistory.previous_status)
         }

         if (this.selectedHistory.booking) {
            this.view_row_booking_number.setSubtitle(this.selectedHistory.booking.booking_number)
         }

         if (this.selectedHistory.user) {
            this.view_row_user_name.setSubtitle(this.selectedHistory.user.name)
         }

      }

   }

   build_card(item: HISTORY_TYPE, side_title: any, sideBox: any, listBox: any) {
      const row = new Adw.ActionRow()
      row.setTitle(`History-${item.action_type}`)
      row.setActivatable(true)
      const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
      row.addPrefix(icon_prefix)
      const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
      row.addSuffix(icon_suffix)
      row.connect("activated", async () => {
         if (item) {
            console.log("selected item:", item)
            this.selectedHistory = item
            console.log("selectedHistory:", this.selectedHistory)
            if (item.changed_by) {
               const user = await this.userService.getUserById(item.changed_by)
               this.selectedHistory.user = user
            }
            if (item.booking_id) {
               const booking = await this.bookingService.getById(item.booking_id)
               this.selectedHistory.booking = booking
            }
            this.build_details()
            side_title.setText(`History Details`)
            sideBox.setVisible(true)
         }
      })
      listBox.append(row)

   }

}