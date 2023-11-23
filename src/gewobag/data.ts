
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
        applicantMessage: `Sehr geehrte Damen und Herren,
wir, die Familie Albakgagi, sind auf der Suche nach einem neuen Zuhause und waren begeistert von der Beschreibung Ihrer ausgeschriebenen Wohnung. Wir sind eine ruhige Familie, und legen großen Wert auf ein harmonisches und gepflegtes Wohnambiente.
Wir sind überzeugt, dass Ihre Wohnung ideal für unsere Bedürfnisse als Familie ist und würden uns sehr über die Möglichkeit freuen, sie persönlich besichtigen zu dürfen. Eine ruhige und freundliche Nachbarschaft ist uns ebenso wichtig wie eine langfristige Mietperspektive, in der wir uns ein stabiles Zuhause aufbauen können.
Könnten Sie uns bitte mögliche Termine für eine Besichtigung mitteilen? Wir sind in unserer Zeitplanung flexibel und werden uns gerne nach Ihnen richten.
Für eine schnelle und unkomplizierte Kommunikation sind wir telefonisch sowie per E-Mail erreichbar.
Wir danken Ihnen herzlich im Voraus für Ihre Rückmeldung und hoffen, bald von Ihnen zu hören.
Mit freundlichen Grüßen
Albakgagi`,
        email: "mamounbk9@gmail.com",
        firstName: "Mamoun",
        lastName: "Albakgagi",
        phoneNumber: "015906675896",
        salutation: "MR",
        street: "Angerburger Allee",
        houseNumber: "53",
        zipCode: "14055",
        city: "Berlin",
        additionalAddressInformation: "7",
        gewobag_gesamtzahl_der_einziehenden_personen_erwachsene_und_kinder: "6",
        min_room_number: 4,
        max_room_number: 6,
        max_price: 1100,
        wbs: true
    },
    {
        applicantMessage: `Sehr geehrte Damen und Herren,
wir, die Familie Almatar, sind aktuell auf der Suche nach einem neuen Zuhause und sind sehr angetan von der Beschreibung Ihrer angebotenen Wohnung. Wir legen großen Wert auf ein ruhiges und gepflegtes Wohnambiente und sind überzeugt, dass Ihre Wohnung ideal für unsere familiären Bedürfnisse ist.
Wir würden uns sehr darüber freuen, die Möglichkeit zu bekommen, die Wohnung persönlich zu besichtigen. Eine ruhige und freundliche Nachbarschaft sowie die Perspektive auf ein langfristiges Mietverhältnis, in dem wir ein stabiles Zuhause aufbauen können, sind uns sehr wichtig.
Könnten Sie uns bitte einige Termine für eine Besichtigung vorschlagen? Wir sind in unserer Zeitplanung flexibel und richten uns gerne nach Ihnen. Für eine schnelle und unkomplizierte Kommunikation sind wir sowohl telefonisch als auch per E-Mail erreichbar.
Wir danken Ihnen im Voraus für Ihre Rückmeldung und hoffen, bald von Ihnen zu hören.
Mit freundlichen Grüßen,
Familie Almatar`,
        email: "jomanaalmatar@gmail.com",
        firstName: "Jomana",
        lastName: "Almatar",
        phoneNumber: "015228103368",
        salutation: "MRS",
        street: "Angerburger Allee",
        houseNumber: "53",
        zipCode: "14055",
        city: "Berlin",
        additionalAddressInformation: "7",
        gewobag_gesamtzahl_der_einziehenden_personen_erwachsene_und_kinder: "6",
        min_room_number: 4,
        max_room_number: 6,
        max_price: 1100,
        wbs: true
    },
]

// // -------  END list of users --------  /// 

const dummyUsers = [{
    applicantMessage: `dzien dobry, 
    jest aktualny?
    dzeki`,
    email: "waelsy123+05@gmail.com",
    firstName: "Michal",
    lastName: "Nowak",
    phoneNumber: "537884031",
    salutation: "MR",
    street: "Emilii Plater",
    houseNumber: "28",
    zipCode: "02625",
    city: "Poznan",
    additionalAddressInformation: "5",
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
