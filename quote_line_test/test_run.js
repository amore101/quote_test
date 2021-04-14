import { quotelineTest } from './test.js';
import pkg from 'selenium-webdriver';
const {Builder, By, Key, until} = pkg;
import 'chromedriver';
import dotenv from 'dotenv';
dotenv.config();

let driver = new Builder().forBrowser('chrome').build();

const args = process.argv.slice(2);

let arg_4 = args[4];
if (args.length > 5) {
    arg_4 = '';
    for (let i=4; i<args.length; i++) {
        if (i === 4) arg_4 += args[i];
        else arg_4 += ' ' + args[i];
    }
}

quotelineTest(args[0], args[1], args[2], args[3], arg_4, driver);

// quoteId, profile, quantity, discount, license_model

// node --experimental-modules test_run a0p2g000001ZBh8AAG Renewals 2 20 Subscription

// change back the profile if test fails

// friday

// from AVC TCV - open oppotunity to check

// a0p2g000001ZD6FAAW
