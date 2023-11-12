
export interface User {
  lastName: string;
  firstName: string;
  street: string;
  zip: string;
  city: string;
  phone: string;
  email: string;
  wbs: boolean;
  desired_room_number: number;
}

export let users: User[] = [{
  lastName: "Albakgagi",
  firstName: "Mamoun",
  street: "Angerburger allee 53 /7OG",
  zip: "14055",
  city: "Berlin",
  phone: "015906675896",
  email: "mamounbk9@gmail.com",
  wbs: true,
  desired_room_number: 3,
}, {
  lastName: "Almatar",
  firstName: "Jomana",
  street: "Tatinger Straße 36",
  zip: "25838",
  city: "Garding",
  phone: "015228103368",
  email: "jomanaalmatar@gmail.com",
  wbs: true,
  desired_room_number: 3,
}, {
  lastName: "Matar",
  firstName: "Hamdan",
  street: "Angerburger Allee 53/7OG",
  zip: "14055",
  city: "Berlin",
  phone: "01783751508",
  email: "waelsy123@gmail.com",
  wbs: true,
  desired_room_number: 4,
}]

const dummyUsers = [{
  lastName: "Almattar",
  firstName: "Mohamad",
  street: "Diesterwegstrasse 9c",
  zip: "10405",
  city: "Berlin",
  phone: "00491783751508",
  email: "mhdwasimalmattar@gmail.com",
  wbs: true,
  desired_room_number: 4,
}, {
  lastName: "Almattar",
  firstName: "Mohamad",
  street: "Diesterwegstrasse 9c",
  zip: "10405",
  city: "Berlin",
  phone: "00491783751508",
  email: "mhdwasimalmattar@gmail.com",
  wbs: true,
  desired_room_number: 3,
}]

if (process.env.NODE_ENV !== 'prod') {
  users = dummyUsers;
}

export const token = "5813573616:AAGp6nX4WEoST5KZH2HtGbhput5KWHQE1dY"