
export interface User {
    gender: string;
    lastName: string;
    firstName: string;
    title: string;
    birthday: string;
    birthmonth: string;
    birthyear: string;
    street: string;
    hausnr: string;
    floor: string;
    doornr: string;
    zip: string;
    city: string;
    desired_room_number: number;
    phone: string;
    email: string;
}

export let users: User[] = [{
    gender: "m",
    lastName: "S A Zeedia",
    firstName: "Haytham",
    title: "t9",
    birthday: "01",
    birthmonth: "03",
    birthyear: "1987",
    street: "Auhofstrasse",
    hausnr: "15a",
    floor: "0",
    doornr: "01",
    zip: "1130",
    city: "Wien",
    desired_room_number: 3,
    phone: "06608118959",
    email: "obaidahantouch730@gmail.com"
},
{
    gender: "m",
    lastName: "Booz",
    firstName: "Bashar",
    title: "t9",
    birthday: "01",
    birthmonth: "01",
    birthyear: "1982",
    street: "Gestettengasse",
    hausnr: "16",
    floor: "6",
    doornr: "19",
    zip: "1030",
    city: "Wien",
    desired_room_number: 4,
    phone: "06608118959",
    email: "obaidahantouch730@gmail.com"
}]

const dummyUsers = [{
    gender: "m",
    lastName: "Janski",
    firstName: "Sam",
    title: "t9",
    birthday: "02",
    birthmonth: "04",
    birthyear: "1995",
    street: "Salmovska",
    hausnr: "10",
    floor: "2",
    doornr: "14",
    zip: "12000",
    city: "Praha",
    phone: "00420535637284",
    desired_room_number: 1,
    email: "waelsy123@gmail.com"
}, {
    gender: "m",
    lastName: "Tyson",
    firstName: "Mike",
    title: "t9",
    birthday: "02",
    birthmonth: "04",
    birthyear: "1995",
    street: "Salmovska",
    hausnr: "10",
    floor: "2",
    doornr: "14",
    zip: "12000",
    city: "Praha",
    phone: "00420535637284",
    desired_room_number: 2,
    email: "waelsy123+mike@gmail.com"
}]

if (process.env.NODE_ENV !== 'prod') {
    users = dummyUsers;
}

export const token = "6736200926:AAH8PpyHW06Nc1XQuylfLCwMFZEpPnhcro0"