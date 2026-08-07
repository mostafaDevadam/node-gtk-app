
import { UserRole } from '../enums.js';
import { Adw, GLib, Gio, Gtk } from '../index.js'
import { AuditLogService } from '../services/auditlogs.service.js';
import { AUDIT_LOG_TYPE } from '../types.js';


export class AuditLogsComponent {

   app: any
   auditLogService: AuditLogService
   auditLogs: AUDIT_LOG_TYPE[] = []
   selectedAuditLog: AUDIT_LOG_TYPE | null = null
   view_row_action_type: any
   view_row_state: any
   view_row_description: any
   view_row_created_at: any
   sideBox: any

   constructor(app: any) {
      this.app = app
      this.auditLogService = new AuditLogService()
   }

   async build_logs_view() {

      const isAdmin = this.app.active_user_role === UserRole.admin || this.app.active_user_role === "admin";


      const box = new Gtk.Box({
         orientation: Gtk.Orientation.VERTICAL,
         spacing: 10,
         marginBottom: 12,
         marginStart: 12,
         marginEnd: 12,
      })
      box.setSizeRequest(240, -1)
      //const lbl = new Gtk.Label({label: "AuditLogs#"})
      //box.append(lbl)
      // in right_sidebar
      this.sideBox = new Gtk.Box({
         orientation: Gtk.Orientation.VERTICAL,
         spacing: 10,
         marginBottom: 12,
         marginStart: 12,
         marginEnd: 12,
         visible: false,
      })
      this.app.right_sidebar.append(this.sideBox)
      const side_title = new Gtk.Label({ label: "Audit-Log" })
      this.sideBox.append(side_title)


      // 
      const view_side_group = new Adw.PreferencesGroup()
      this.sideBox.append(view_side_group)
      //
      this.view_row_action_type = new Adw.ActionRow()
      view_side_group.add(this.view_row_action_type)
      this.view_row_action_type.setTitle(`Action Type`)
      //view_row_action_type.setSubtitle(`${this.selectedAuditLog.action_type}`)

      this.view_row_state = new Adw.ActionRow()
      view_side_group.add(this.view_row_state)
      this.view_row_state.setTitle(`State`)
      //view_row_state.setSubtitle(`${this.selectedAuditLog.state}`)

      this.view_row_description = new Adw.ActionRow()
      view_side_group.add(this.view_row_description)
      this.view_row_description.setTitle(`Description`)
      //view_row_description.setSubtitle(`${this.selectedAuditLog.description}`)

      this.view_row_created_at = new Adw.ActionRow()
      view_side_group.add(this.view_row_created_at)
      this.view_row_created_at.setTitle(`Created at`)
      //view_row_created_at.setSubtitle(`${this.selectedAuditLog.created_at}`)


      this.build_details()
      //

      const group = new Adw.PreferencesGroup()
      const listBox = new Gtk.ListBox()
      group.add(listBox)
      box.append(group)

      /*for(let item of [1,2,3]){
         this.build_card(item, side_title, sideBox, listBox)
      }*/

      this.auditLogs = await this.auditLogService.getAll()

      if (this.auditLogs && this.auditLogs.length >= 0 && isAdmin) {
         for (let item of this.auditLogs) {
            this.build_card(item, side_title, this.sideBox, listBox)
         }
      }



      this.app.template_view.build_template_view("AuditLogs", "home_audit_logs_view", box)

   }

   build_details() {

      if (!this.selectedAuditLog) {
         console.log("no selected audit-log")
         return
      }


      this.view_row_action_type.setSubtitle(`${this.selectedAuditLog.action_type}`)


      this.view_row_state.setSubtitle(`${this.selectedAuditLog.state}`)


      this.view_row_description.setSubtitle(`${this.selectedAuditLog.description}`)


      this.view_row_created_at.setSubtitle(`${this.selectedAuditLog.created_at}`)

   }

   build_card(item: AUDIT_LOG_TYPE, side_title: any, sideBox: any, listBox: any) {
      const row = new Adw.ActionRow()
      row.setTitle(`Audit-Log-${item.action_type}-${item.state}`)
      row.setSubtitle(item.created_at!!)
      row.setActivatable(true)
      const icon_prefix = Gtk.Image.newFromIconName("emblem-documents")
      row.addPrefix(icon_prefix)
      const icon_suffix = Gtk.Image.newFromIconName("go-next-symbolic")
      row.addSuffix(icon_suffix)
      row.connect("activated", () => {
         if (item) {
            this.selectedAuditLog = item
            this.build_details()
            side_title.setText(`Audi-Log ${item.action_type}-${item.state}`)
            sideBox.setVisible(true)
         }

      })
      listBox.append(row)

   }

}


