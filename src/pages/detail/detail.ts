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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public contactService: ContactService,
    public emailComposer: EmailComposer,
    public alertController: AlertController,
    public platform: Platform,
    public callNumber: CallNumber) {

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.contactService.find(this.selectedItem.id).then(contact => {
      this.id = contact.id;
      this.name = contact.name;
      this.email = contact.email;
      this.phone = contact.phone;
    });

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
    };

    this.contactService.save(item).then(
      contact => {

        this.navCtrl.pop();

      });
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
