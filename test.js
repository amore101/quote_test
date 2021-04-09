import pkg from 'selenium-webdriver';
const {Builder, By, Key, until} = pkg;
import 'chromedriver';
import dotenv from 'dotenv';
dotenv.config();

const account = process.env.ACCOUNT;
const password = process.env.PASSWORD;
let x = '';
// let x = {profile: 'aaa'};

const QLE_Test = async() => {

    // console.log(x.profile);
    fun ();
    console.log(x);


    
    // // how to use date object
    // const dateee = new Date("2021-03-01");
    // dateee.setDate(dateee.getDate() + 1);
    // console.log(dateee);
    // console.log(dateee.toLocaleDateString("en-US"));
}

const fun = () => {
    x = 'xx';
}

const args = process.argv.slice(2);
QLE_Test(args[0]);
// args.forEach(arg => {
//     console.log(arg);
//     quotesTest(arg);
// });

// a0p1I0000097Y3lQAE