
import { Adw, GLib, Gio, Gtk } from '../index.js'



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