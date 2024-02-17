
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
    max_deposit: number;
    max_price: number;
}
export let users: User[] = [
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
    email: "obaidahantouch730@gmail.com",
    max_deposit: 15000,
    max_price: 1200
}, {
    gender: "m",
    lastName: "Jangir",
    firstName: "khaled",
    title: "t9",
    birthday: "16",
    birthmonth: "04",
    birthyear: "1976",
    street: "kirchengasse",
    hausnr: "3",
    floor: "1",
    doornr: "1",
    zip: "7551",
    city: "Stegersbach",
    desired_room_number: 3,
    phone: " ",
    email: "obaidahantouch730@gmail.com",
    max_deposit: 28000,
    max_price: 1800
}, {
    gender: "m",
    lastName: "Jangir",
    firstName: "khaled",
    title: "t9",
    birthday: "16",
    birthmonth: "04",
    birthyear: "1976",
    street: "kirchengasse",
    hausnr: "3",
    floor: "1",
    doornr: "1",
    zip: "7551",
    city: "Stegersbach",
    desired_room_number: 4,
    phone: " ",
    email: "obaidahantouch730@gmail.com",
    max_deposit: 28000,
    max_price: 1800
}, {
    gender: "m",
    lastName: "Jangir",
    firstName: "khaled",
    title: "t9",
    birthday: "16",
    birthmonth: "04",
    birthyear: "1976",
    street: "kirchengasse",
    hausnr: "3",
    floor: "1",
    doornr: "1",
    zip: "7551",
    city: "Stegersbach",
    desired_room_number: 5,
    phone: " ",
    email: "obaidahantouch730@gmail.com",
    max_deposit: 28000,
    max_price: 1800
}]

const dummyUsers: User[] = [
        {
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
        desired_room_number: 2,
        email: "waelsy123@gmail.com",
        max_deposit: 15000,
        max_price: 1000
    },
    {
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
        desired_room_number: 3,
        phone: " ",
        email: "waelsy123+mike@gmail.com",
        max_deposit: 30000,
        max_price: 2000
    }]

if (process.env.NODE_ENV !== 'prod') {
    users = dummyUsers;
}

export const token = "5885795688:AAElkwJZiBfuVhEtno2ZdciD6pLQRKzC8Og"
