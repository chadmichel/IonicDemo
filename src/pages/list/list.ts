import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import { ContactService } from '../../services/contactservice';
import { ContactDetail } from '../../DTO/contactdetail';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
 
  items: Array<ContactDetail>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public contactService: ContactService) {
    
    contactService.getAllContactDetails().then(
      contacts => {

        this.items = [];
        for(var i = 0; i < contacts.length; i++) {
          var item = contacts[i];
          this.items.push(item);
        }

      });
  }

  itemTapped(event, item) {
    // we changed this code to use the DetailPage
    this.navCtrl.push(DetailPage, {
      item: item
    });
  }
}
