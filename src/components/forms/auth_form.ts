import {Adw, GLib, Gio, Gtk} from '../../index.js'
import { AUTH } from '../../types.js'

export class AuthForm extends Gtk.Box {

    validation_name: any
    validation_email: any
    validation_password: any
    isValidName = false
    isValidEmail = false
    isValidPass = false
    isRegister = false

    role_items = ["admin", "employee"]

    app: any

    role_row: any
    role_model: any


    constructor(app: any,title: string, isRegister: boolean, submit_event: (data: AUTH) => void){
        super({
             orientation: Gtk.Orientation.VERTICAL,
            spacing: 12,
            marginTop: 24,
            marginBottom: 24,
            marginStart: 24,
            marginEnd: 24,
        })
        this.app = app
        this.role_model = new Gtk.StringList()
        this.role_row = new Adw.ComboRow()

        this.app.refresh_role_row(this.role_model, this.role_row);
        
        


        
        

        this.append(new Gtk.Label({ label: title }));

        this.isRegister = isRegister


        // role
       

        this.role_row = new Adw.ComboRow({
          title: "Role"
        })

        //this.app.register_widget(role_row, "title", "role")
        
        this.role_model = new Gtk.StringList()

        //this.role_row.setModel(this.role_model)

         this.app.register_widget(this.role_row, "title", "role");

         this.role_row = this.app.refresh_role_row(this.role_model, this.role_row);
        
        this.role_row.connect("notify::selected", (combo_row: any) => {
                  const selected_index = this.role_row.getSelected()
                  console.log("selected_index:", selected_index)
                  if (selected_index === 4294967295 || selected_index < 0 ){
                      return
                  }
                 
                  this.updated_selected_role(selected_index)       
        })
        //this.append(role_row)
        this.updated_selected_role(this.role_row.getSelected())

        const group = new Adw.PreferencesGroup()
        group.add(this.role_row)
        this.append(group)

        //this.refresh_role_dropdown();



       





       
        // name
        const input_name = new Gtk.Entry({
            inputPurpose: Gtk.InputPurpose.NAME,
            placeholderText: "Enter Name",
        })
        input_name.connect("notify::text", () => this.on_name_changed(input_email))

        if(this.isRegister){
            this.append(input_name)
             // validation email
            this.validation_name = new Gtk.Label({label: "Name is required"})
            this.validation_name.setVisible(false)
            this.append(this.validation_name)
        }


        // email 
        const input_email = new Gtk.Entry({
            inputPurpose: Gtk.InputPurpose.EMAIL,
            placeholderText: "Enter Email",

        }) 

        input_email.connect("notify::text", () => this.on_email_changed(input_email))

        this.append(input_email)
        // validation email
         this.validation_email = new Gtk.Label({label: "Email is required"})
         this.validation_email.setVisible(false)
        this.append(this.validation_email)

        // password
        const input_password = new Gtk.Entry({
            inputPurpose: Gtk.InputPurpose.PASSWORD,
            placeholderText: "Enter Password",
            visibility: false,
            

        })
        input_password.connect("notify::text", () => this.on_password_changed(input_password))
        this.append(input_password)
        // validation email
        this.validation_password = new Gtk.Label({label: "Password is required"})
        this.validation_password.setVisible(false)
        this.append(this.validation_password)


         const btn = new Gtk.Button({
          label: title,

        })

        btn.on("clicked", () => {
            console.log("clicked!!!")

            if(this.isRegister && !this.isValidName) {
                this.validation_name.setVisible(true)
            }
            
            if(!this.isValidEmail){
                this.validation_email.setVisible(true)
                
            }
            if(!this.isValidPass){
                this.validation_password.setVisible(true)
                this.validation_password.setText("password is invalid!")
                return
            }
            console.log(`email: ${input_email.text} , password: ${input_password.text}`)

            
            submit_event(!isRegister ? {
                email: input_email.text, 
                password: input_password.text
                } : 
                {
                name: input_name.text,
                email: input_email.text, 
                password: input_password.text
                })
        })

        this.append(btn)
    }

    refresh_role_dropdown() {
            if (!this.role_model || !this.role_row ) return;

            // Save current selection index so the user doesn't lose their place
            const currentIndex = this.role_row?.getSelected();

            console.log("refresh_role_dropdown currentIndex:", currentIndex)

            // Clear the native list by splicing out all items
            // (In node-gtk, you pass the position and number of items to remove)
            const totalItems = this.role_model?.getNItems();
            if (totalItems > 0) {
                this.role_model.splice(0, totalItems, null);
            }

            // Append the freshly translated text strings
            this.role_items.forEach((key) => {
                const translatedString = this.app._(key); // e.g., "Mitarbeiter" or "موظف"
                console.log("translatedString:", translatedString)
                this.role_model.append(translatedString);
            });

            

            // Restore their original selected index location
            if (currentIndex !== 4294967295) {
                this.role_row.setSelected(currentIndex);
            }
        }


    updated_selected_role(selectedIndex: number){

        const chosen_role = this.role_items[selectedIndex]

        console.log("updated_selected_role chosen_role:", chosen_role)

        //this.refresh_role_dropdown()
        const translatedString = this.app._(chosen_role.toLocaleLowerCase()); // e.g., "Mitarbeiter" or "موظف"
        //this.role_items[selectedIndex] = translatedString
        //this.role_model.append(translatedString);

        console.log("updated_selected_role translatedString:", translatedString)

       

        


        //console.log("translatedString:", translatedString)
        //this.role_model.append(translatedString);

    }


     on_name_changed(entry: any){
        //console.log("input email changed:", entry)
        //const text = entry.text
        const currentText = entry.text
        console.log("input name changed:", currentText);

        if(currentText.length == 0){
           this.validation_name.setVisible(true)
           this.isValidName = false
        } //else if (currentText.length <= 3)
        else {
             this.validation_name.setVisible(false)
             this.isValidName = true
        }

    }


    on_email_changed(entry: any){
        //console.log("input email changed:", entry)
        //const text = entry.text
        const currentText = entry.text
        console.log("input email changed:", currentText);

        if(currentText.length == 0){
           this.validation_email.setVisible(true)
           this.isValidEmail = false
        } //else if (currentText.length <= )
        else {
             this.validation_email.setVisible(false)
             this.isValidEmail = true
        }

    }

    on_password_changed(entry: any){
        const currentText = entry.text
        console.log("input password changed:", currentText);

         if(currentText.length == 0){
           this.validation_password.setVisible(true)
           this.isValidPass = false
        }
        else if (currentText.length <= 3) {
            this.validation_password.setText("password is too short!")
            this.validation_password.setVisible(true)
            this.isValidPass = false
        }
        else if (currentText.length > 3) {
            //this.validation_password.setText("password is too short!")
            this.validation_password.setVisible(false)
            this.isValidPass = true
        }
        else {
             this.validation_email.setVisible(false)
             this.isValidPass = true
        }

    }


}
