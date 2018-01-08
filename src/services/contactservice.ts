import { Injectable } from "@angular/core";
import { ContactDetail } from '../DTO/contactdetail';

@Injectable()
export class ContactService {

    // mock calls - do not make calls to real backend
    MOCK_DATA = {
        contacts: [
            {
                id: "1",
                name: "John Smith",
                email: "john@example.com",
                phone: "555-555-5555",
                imageUrl: '/assets/imgs/pic1.png'
            },
            {
                id: "2",
                name: "Mary Williams",
                email: "mary@example.com",
                phone: "555-555-5555", 
                imageUrl: '/assets/imgs/pic2.png'
            },
        ]
    };

    constructor() {
    }

    public getAllContactDetails(): Promise<ContactDetail[]> {        
        return Promise.resolve(this.MOCK_DATA.contacts);
    }

    public find(id: string): Promise<ContactDetail> {
        var item = this.MOCK_DATA.contacts.find(x => x.id == id);
        return Promise.resolve({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            imageUrl: item.imageUrl,
        });
    }

    public save(contact: ContactDetail) {
        var item = this.MOCK_DATA.contacts.find(x => x.id == contact.id);
        item.name = contact.name;
        item.email = contact.email;
        item.phone = contact.phone;
        item.imageUrl = contact.imageUrl;
        return this.find(contact.id);
    }
}