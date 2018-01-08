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
 
  allItems: Array<ContactDetail>;
  items: Array<ContactDetail>;
  filter: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public contactService: ContactService) {
    
    contactService.getAllContactDetails().then(
      contacts => {

        this.items = [];
        this.allItems = [];

        for(var i = 0; i < contacts.length; i++) {
          var item = contacts[i];
          this.items.push(item);
          this.allItems.push(item);
        }

      });
  }

  itemTapped(event, item) {
    // we changed this code to use the DetailPage
    this.navCtrl.push(DetailPage, {
      item: item
    });
  }

  onFilter(e, x) {
    this.items = [];
    for(var i = 0; i < this.allItems.length; i++) {
      var item : ContactDetail = this.allItems[i];
      if (item.name != null && item.name.toLowerCase().includes(this.filter.toLowerCase()))
        this.items.push(item); 
    }
  }
}
