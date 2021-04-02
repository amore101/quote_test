const {Builder, By, Key, until} = require('selenium-webdriver');
require('chromedriver');
const Assert = require('assert');
require('dotenv').config();

const account = process.env.ACCOUNT;
const password = process.env.PASSWORD;

test = () => {
    console.log(typeof(account));
    console.log(typeof(password));
}

// test();

QLE_Test = async() => {

    console.log(".");
    console.log('\.');

    // // how to use date object
    // const dateee = new Date("2021-03-01");
    // dateee.setDate(dateee.getDate() + 1);
    // console.log(dateee);
    // console.log(dateee.toLocaleDateString("en-US"));
}

const args = process.argv.slice(2);
QLE_Test();
// args.forEach(arg => {
//     console.log(arg);
//     quotesTest(arg);
// });

// a0p1I0000097Y3lQAE