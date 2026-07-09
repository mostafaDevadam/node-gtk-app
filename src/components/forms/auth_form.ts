import {Adw, GLib, Gio, Gtk} from '../../index.js'

export class AuthForm extends Gtk.Box {

    validation_name: any
    validation_email: any
    validation_password: any
    isValidName = false
    isValidEmail = false
    isValidPass = false
    isRegister = false

    constructor(app: any,title: string, isRegister: boolean, submit_event: () => void){
        super({
             orientation: Gtk.Orientation.VERTICAL,
            spacing: 12,
            marginTop: 24,
            marginBottom: 24,
            marginStart: 24,
            marginEnd: 24,
        })


        
        

        this.append(new Gtk.Label({ label: title }));

        this.isRegister = isRegister

       
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
            //submit_event()
        })

        this.append(btn)
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
