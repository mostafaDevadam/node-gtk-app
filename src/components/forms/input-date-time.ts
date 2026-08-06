
import { Adw, GLib, Gio, Gtk } from '../../index.js'


export class InputDateTime {

   input_time: any




   build(parent: any, title: string, input_time: any) {

    const input_date_time = new Adw.EntryRow({
      title: title,
      inputPurpose: Gtk.InputPurpose.NAME,
      editable: false,
    })
    parent.add(input_date_time)


    const pickerButton = new Gtk.Button({
      iconName: 'x-office-calendar-symbolic',
      valign: Gtk.Align.CENTER,
      cssClasses: ['flat'],
    })
    input_date_time.addSuffix(pickerButton)

    // Create the GTK Calendar widget
    const popover = new Gtk.Popover({
      hasArrow: true,
    })

    // 3. Create a Gtk.Popover to hold the combined layout
    popover.setParent(pickerButton)

    // Main container inside the popover
    const popoverBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 12,
      marginStart: 12,
      marginEnd: 12,
      marginTop: 12,
      marginBottom: 12,
    })

    // Add the Gtk.Calendar
    const calendar = new Gtk.Calendar()
    popoverBox.append(calendar)

    // Time selection container (Hours : Minutes spin buttons)
    const timeBox = new Gtk.Box({
      orientation: Gtk.Orientation.HORIZONTAL,
      spacing: 6,
      halign: Gtk.Align.CENTER,
    })

    const hourSpin = new Gtk.SpinButton({
      adjustment: new Gtk.Adjustment({
        lower: 0,
        upper: 23,
        stepIncrement: 1,
        pageIncrement: 1,
      }),
      digits: 0,
      wrap: true,
    })
    // Set current hour default
    const now = new Date()
    hourSpin.setValue(now.getHours())

    const colonLabel = new Gtk.Label({ label: ':' })

    const minuteSpin = new Gtk.SpinButton({
      adjustment: new Gtk.Adjustment({
        lower: 0,
        upper: 59,
        stepIncrement: 1,
        pageIncrement: 5,
      }),
      digits: 0,
      wrap: true,
    })
    minuteSpin.setValue(now.getMinutes())

    timeBox.append(hourSpin)
    timeBox.append(colonLabel)
    timeBox.append(minuteSpin)
    popoverBox.append(timeBox)

    // Confirm button to apply date + time to the EntryRow
    const applyButton = new Gtk.Button({ label: 'Apply' })
    popoverBox.append(applyButton)

    popover.setChild(popoverBox)

    // 4. Show the popover when the suffix button is clicked
    pickerButton.on('clicked', () => {
      popover.popup()
    })

    // 5. Format string and update entry text when 'Apply' is clicked
    applyButton.on('clicked', () => {
      const datetime = calendar.getDate() // Returns GLib.DateTime
      /*const year = datetime.getYear()
      const month = String(datetime.getMonth() + 1).padStart(2, '0')
      const day = String(datetime.getDayOfWeek()).padStart(2, '0') // Note: getDay() or formatting options
*/
      // Format cleanly using GLib.DateTime fields if needed, or JS parsing:
      const formattedDate = datetime.format('%Y-%m-%d')

      const hours = String(hourSpin.getValue()).padStart(2, '0')
      const minutes = String(minuteSpin.getValue()).padStart(2, '0')

      // Combine into the EntryRow
      input_date_time.setText(`${formattedDate} ${hours}:${minutes}`)
      this.input_time = input_date_time.getText()
      popover.popdown()
    })

    input_date_time.addSuffix(pickerButton)

    return input_date_time.getText()


  }




}