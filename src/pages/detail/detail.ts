import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactService } from '../../services/contactservice';
import { ContactDetail } from '../../DTO/contactdetail';
import { EmailComposer } from '@ionic-native/email-composer';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-list',
  templateUrl: 'detail.html'
})
export class DetailPage {
  selectedItem: ContactDetail;

  id: string;
  name: string;
  email: string;
  phone: string;
  startImageUrl: string;
  imageSrc: any;
  hasPhoto: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public contactService: ContactService,
    public emailComposer: EmailComposer,
    public alertController: AlertController,
    public platform: Platform,
    public callNumber: CallNumber) {

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.hasPhoto = false;

    if (this.selectedItem.id != null && this.selectedItem.id.length > 0 && this.selectedItem.id != "0") {
      this.contactService.find(this.selectedItem.id).then(contact => {
        this.id = contact.id;
        this.name = contact.name;
        this.email = contact.email;
        this.phone = contact.phone;
        this.startImageUrl = contact.imageUrl;

        if (this.startImageUrl != null && this.startImageUrl.length > 0)
          this.hasPhoto = true;
      });
    }
    else {
      this.id = this.selectedItem.id;
      this.name = this.selectedItem.name;
      this.email = this.selectedItem.email;
      this.phone = this.selectedItem.phone;
      this.startImageUrl = this.selectedItem.imageUrl;
    }
  }

  alertMessage(title, detail) {
    let alert = this.alertController.create({
      title: title,
      subTitle: detail,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  save() {
    var item = {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      imageUrl: this.startImageUrl
    };

    if (this.imageSrc != null)
      item.imageUrl = this.imageSrc;

    this.contactService.save(item).then(
      contact => {

        this.navCtrl.pop();

      });
  }

  uploadPicture() {
    var src = this.imageSrc;
    var filebtn : any = document.getElementById('filebtn');
    filebtn.onchange = function(x) {
      var file = filebtn.files[0];
      var fileReader = new FileReader();
      fileReader.onloadend = function (e : any) {
        var arrayBuffer = e.target.result;
        
        var imgCtrl : any = document.getElementById('imageControl');
        imgCtrl.src = arrayBuffer;
        
      };
      fileReader.readAsDataURL(file);
      
    };
    filebtn.click();
  }

  useCamera() {
    alert('camera');
  }

  sendEmail() {
    if (this.platform.is('cordova')) {
      this.emailComposer.requestPermission().then(yesNo => {
        if (this.email != null && this.email.length > 0) {
          this.emailComposer.isAvailable().then((available: boolean) => {
            if (available) {
              let email = {
                to: this.email,
                attachments: [
                ],
                subject: 'Hey',
                body: '',
                isHtml: true
              };

              // Send a text message using default options
              this.emailComposer.open(email);
            } else {
              this.alertMessage('Email not available', "Email is not configured on this device, or this application doesn't have access to email");
            }
          });
        } else {
          this.alertMessage('No email address', 'You need to save an email address before you can send an email.');
        }
      });
    } else {
      this.alertMessage('Not running in device mode.', 'You can only send an email when running as an application');
    }
  }

  usePhone() {
    if (this.platform.is('cordova')) {
      if (this.phone != null && this.phone.length > 0) {
        this.callNumber.callNumber(this.phone, true)
          .then(() => console.log('Launched dialer!'))
          .catch(() => {
            this.alertMessage('Unable to use phone', "Application was unable to use the device's phone");
          });
      } else {
        this.alertMessage('No phone number', 'You need to save a phone number before you can dial a number.');
      }
    } else {
      this.alertMessage('Not running in device mode.', 'You can only send an email when running as an application');
    }
  }
}
