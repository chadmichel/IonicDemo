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
                email: "",
                phone: "",
            },
            {
                id: "2",
                name: "Mary Williams",
                email: "",
                phone: "",
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
            phone: item.phone
        });
    }

    public save(contact: ContactDetail) {
        var item = this.MOCK_DATA.contacts.find(x => x.id == contact.id);
        item.name = contact.name;
        item.email = contact.email;
        item.phone = contact.phone;
        return this.find(contact.id);
    }
}