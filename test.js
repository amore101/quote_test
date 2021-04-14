import pkg from 'selenium-webdriver';
const {Builder, By, Key, until} = pkg;
import 'chromedriver';
import dotenv from 'dotenv';
dotenv.config();

const account = process.env.ACCOUNT;
const password = process.env.PASSWORD;

let x = '';
const QLE_Test = async(x) => {
    console.log(x);
    x += '2';
    console.log(x);





    // // Open the sandbox
    // let driver = new Builder()
    //     .forBrowser('chrome').build();

    // await (await driver).manage().setTimeouts({ implicit:10000 });
    // await driver.get('https://tibcocpq--sandbox.lightning.force.com/lightning/page/home');

    // // Log in with email and password
    // await driver.findElement(By.css('#email')).sendKeys(account);
    // await driver.findElement(By.css('#next')).click();
    // await driver.wait(until.elementLocated(By.css('#password'))).sendKeys(password);
    // await driver.wait(until.elementLocated(By.css('#taLogin'))).click();

    // // Get quote by url (id)
    // await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/one/one.app#eyJjb21wb25lbnREZWYiOiJvbmU6YWxvaGFQYWdlIiwiYXR0cmlidXRlcyI6eyJhZGRyZXNzIjoiaHR0cHM6Ly90aWJjb2NwcS0tc2FuZGJveC0tYy52aXN1YWxmb3JjZS5jb20vYXBleC9lZGl0TGluZXNSZWRpcmVjdD9pZD1hMHAyZzAwMDAwMVpDeHJBQUcifSwic3RhdGUiOnt9fQ%3D%3D');




    
    // // how to use date object
    // const dateee = new Date("2021-03-01");
    // dateee.setDate(dateee.getDate() + 1);
    // console.log(dateee);
    // console.log(dateee.toLocaleDateString("en-US"));
}


const args = process.argv.slice(2);
QLE_Test(x);

console.log(x);
// console.log(typeof(x.toString()));
// args.forEach(arg => {
//     console.log(arg);
//     quotesTest(arg);
// });

// a0p1I0000097Y3lQAE