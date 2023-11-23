
export interface User {
    applicantMessage: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    salutation: string;
    street: string;
    houseNumber: string;
    zipCode: string;
    city: string;
    additionalAddressInformation: string;
    gewobag_gesamtzahl_der_einziehenden_personen_erwachsene_und_kinder: string;
    min_room_number: number;
    max_room_number: number;
    max_price: number;
    wbs: boolean
}

// // -------  Edit list of users --------  /// 

export let users: User[] = [
    {
        applicantMessage: "dzien dobry, jes aktualny?",
        email: "waelsy123+1@gmail.com",
        firstName: "Michal",
        lastName: "Nowak",
        phoneNumber: "537884031",
        salutation: "MR",
        street: "Emilii Plater",
        houseNumber: "28",
        zipCode: "02625",
        city: "Poznan",
        additionalAddressInformation: "nic nie ma",
        gewobag_gesamtzahl_der_einziehenden_personen_erwachsene_und_kinder: "6",
        min_room_number: 4,
        max_room_number: 6,
        max_price: 1100,
        wbs: false
    }]

// // -------  END list of users --------  /// 

const dummyUsers = [{
    applicantMessage: "dzien dobry, jes aktualny?",
    email: "waelsy123+04@gmail.com",
    firstName: "Michal",
    lastName: "Nowak",
    phoneNumber: "537884031",
    salutation: "MR",
    street: "Emilii Plater",
    houseNumber: "28",
    zipCode: "02625",
    city: "Poznan",
    additionalAddressInformation: "nic nie ma",
    gewobag_gesamtzahl_der_einziehenden_personen_erwachsene_und_kinder: "6",
    min_room_number: 4,
    max_room_number: 6,
    max_price: 2100,
    wbs: false
}]

if (process.env.NODE_ENV !== 'prod') {
    users = dummyUsers;
}

export const token = "6736200926:AAH8PpyHW06Nc1XQuylfLCwMFZEpPnhcro0"