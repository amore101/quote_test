import { quotelineTest } from './test.js';
import pkg from 'selenium-webdriver';
const {Builder, By, Key, until} = pkg;
import 'chromedriver';
import dotenv from 'dotenv';
dotenv.config();

const account = process.env.ACCOUNT;
const password = process.env.PASSWORD;

let driver = new Builder().forBrowser('chrome').build();

// Initialization
const Initialization = async(driver) => {
    // Open the sandbox
    await (await driver).manage().setTimeouts({ implicit:10000 });
    await driver.get('https://tibcocpq--sandbox.lightning.force.com/lightning/page/home');

    // Log in with email and password
    await driver.findElement(By.css('#email')).sendKeys(account);
    await driver.findElement(By.css('#next')).click();
    await driver.wait(until.elementLocated(By.css('#password'))).sendKeys(password);
    await driver.wait(until.elementLocated(By.css('#taLogin'))).click();
}


const args = process.argv.slice(2);

let arg_4 = args[4];
if (args.length > 5) {
    arg_4 = '';
    for (let i=4; i<args.length; i++) {
        if (i === 4) arg_4 += args[i];
        else arg_4 += ' ' + args[i];
    }
}

const test_run = async() => {
    await Initialization(driver);
    await quotelineTest(args[0], args[1], args[2], args[3], arg_4, driver);
}

test_run();




// quoteId, profile, quantity, discount, license_model

// node --experimental-modules test_run a0p2g000001ZBh8AAG Renewals 2 20 Subscription

// change back the profile if test fails

// friday

// from AVC TCV - open oppotunity to check

// a0p2g000001ZD6FAAW
