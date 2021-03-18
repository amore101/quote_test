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

quotesTest = async(quoteId) => {

    // open the sandbox
    let driver = new Builder().forBrowser('chrome').build();
    await driver.get('https://tibcocpq--sandbox.lightning.force.com/lightning/page/home');

    // log in with email and password
    await driver.findElement(By.css('#email')).sendKeys(account);
    await driver.findElement(By.css('#next')).click();
    await driver.wait(until.elementLocated(By.css('#password'))).sendKeys(password);
    await driver.wait(until.elementLocated(By.css('#taLogin'))).click();

    // get quote by url (id)
    await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/'+ quoteId + '/view');

    // recall approval & submit
    await driver.wait(until.elementLocated(By.xpath("//button[@name='SBQQ__Quote__c.AARecall']")), 10000)
      .click().then(() => console.log("recalled!"));
    await driver.wait(until.elementLocated(By.xpath("//button[@name='SBQQ__Quote__c.AASubmit']")), 10000)
      .click().then(() => console.log("submitted!"));
    
    // check status & recordType
    await driver.wait(until.elementLocated(By.xpath("//slot/slot/lightning-formatted-text[contains(text(), 'Approved')]")), 10000)
      .then(() => console.log("status checked!"));

    await driver.wait(until.elementLocated(By.xpath("//span[@force-recordtype_recordtype='']")), 10000)
      .getText()
      .then(text => {
          Assert.equal(text, 'Approved Quote');
          console.log("recordType checked!");
      })

    // driver.quit();
}

// all quotes need to be tested
const quoteIds = ['a0p6s000000tdivAAA'];
quoteIds.forEach(id => {
    quotesTest(id);
})
