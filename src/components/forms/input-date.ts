import {Adw, GLib, Gio, Gtk} from '../../index.js'


export class InputDate{


    static build(parent: any, title: string){

         const input_date = new Adw.EntryRow({
            title: title,
            inputPurpose: Gtk.InputPurpose.NAME,
            editable: false,
          })
          parent.add(input_date)

        // Create the GTK Calendar widget
          const popover = new Gtk.Popover({
            hasArrow: true,
          })
          const calendar = new Gtk.Calendar()
          //box.append(calendar)
          popover.setChild(calendar)
          

          // Action button to read the selected date
          const calendar_button = new Gtk.Button({ 
            iconName: 'x-office-calendar-symbolic',
            valign: Gtk.Align.CENTER,
            cssClasses: ['flat'],

           })
           popover.setParent(calendar_button)
           input_date.addSuffix(calendar_button)


          calendar_button.on('clicked', () => {
            // In GTK 4, calendar.getDate() returns a GLib.DateTime
            const datetime = calendar.getDate()
            console.log(`Selected Date: ${datetime.format('%Y-%m-%d')}`)

            popover.popup()
          })
          //box.append(calendar_button)

          //parent.add(box)

          calendar.on('day-selected',() => {
               
                const datetime = calendar.getDate()
                const dateString = datetime.format("%Y-%m-%d")
                input_date.setText(dateString!!)
                popover.popdown()
          })
    }
}