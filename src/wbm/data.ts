
export interface User {
  sex: string;
  lastName: string;
  firstName: string;
  street: string;
  zip: string;
  city: string;
  phone: string;
  email: string;
  wbs: boolean;
  min_room_number: number;
  max_room_number: number;
  expireDate: string;
  zimmeranzahl: number;
  wbsCode: number;
}

export let users: User[] = [{
  sex: "Herr",
  lastName: "Albakgagi",
  firstName: "Mamoun",
  street: "Angerburger allee 53 /7OG",
  zip: "14055",
  city: "Berlin",
  phone: "015906675896",
  email: "mamounbk9@gmail.com",
  wbs: true,
  min_room_number: 3,
  max_room_number: 6,
  expireDate: "2024-10-31",
  zimmeranzahl: 6,
  wbsCode: 100
}, {
  sex: "Frau",
  lastName: "Almatar",
  firstName: "Jomana",
  street: "Tatinger Straße 36",
  zip: "25838",
  city: "Garding",
  phone: "015228103368",
  email: "jomanaalmatar@gmail.com",
  wbs: true,
  min_room_number: 3,
  max_room_number: 6,
  expireDate: "2024-10-31",
  zimmeranzahl: 6,
  wbsCode: 100
}, {
  sex: "Herr",
  lastName: "Matar",
  firstName: "Hamdan",
  street: "Angerburger Allee 53/7OG",
  zip: "14055",
  city: "Berlin",
  phone: "01783751508",
  email: "wasim_3331@hotmail.com",
  wbs: true,
  min_room_number: 2.5,
  max_room_number: 3,
  expireDate: "2024-11-30",
  zimmeranzahl: 3,
  wbsCode: 100
}, {
  sex: "Frau",
  lastName: "Aljarad",
  firstName: "Linah",
  street: "Angerburger Allee 53/7OG",
  zip: "14055",
  city: "Berlin",
  phone: "01783751508",
  email: "wasim_3331@hotmail.com",
  wbs: true,
  min_room_number: 2.5,
  max_room_number: 3,
  expireDate: "2024-11-30",
  zimmeranzahl: 3,
  wbsCode: 100
}]

const dummyUsers = [{
  sex: "Herr",
  lastName: "hassan",
  firstName: "adf",
  street: "Diesterwegstrasse 9c",
  zip: "10405",
  city: "Berlin",
  phone: "00491783831508",
  email: "mhdwasimalmattar@gmail.com",
  wbs: true,
  min_room_number: 2.5,
  max_room_number: 3,
  expireDate: "2024-11-30",
  zimmeranzahl: 3,
  wbsCode: 160
}, {
  sex: "Herr",
  lastName: "Mike",
  firstName: "Mike",
  street: "Diesterwegstrasse 9c",
  zip: "10405",
  city: "Berlin",
  phone: "00491727374738",
  email: "mhdwasimalmattar@gmail.com",
  wbs: true,
  min_room_number: 4,
  max_room_number: 6,
  expireDate: "2024-11-30",
  zimmeranzahl: 4,
  wbsCode: 140
}]

if (process.env.NODE_ENV !== 'prod') {
  users = dummyUsers;
}

export const token = "5813573616:AAGp6nX4WEoST5KZH2HtGbhput5KWHQE1dY"