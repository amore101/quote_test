import pkg from 'selenium-webdriver';
const {Builder, By, Key, until} = pkg;
import 'chromedriver';
import dotenv from 'dotenv';
dotenv.config();

const account = process.env.ACCOUNT;
const password = process.env.PASSWORD;

const QLE_Test = async() => {

    // Open the sandbox
    let driver = new Builder()
        .forBrowser('chrome').build();

    await (await driver).manage().setTimeouts({ implicit:10000 });
    await driver.get('https://tibcocpq--sandbox.lightning.force.com/lightning/page/home');

    // Log in with email and password
    await driver.findElement(By.css('#email')).sendKeys(account);
    await driver.findElement(By.css('#next')).click();
    await driver.wait(until.elementLocated(By.css('#password'))).sendKeys(password);
    await driver.wait(until.elementLocated(By.css('#taLogin'))).click();

    // Get quote by url (id)
    await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/a0p2g000001ZD6FAAW/view');

    // navigate to opp
    try {
        let navigate_to_opp = await driver.wait(until.elementLocated(By.xpath("//span[.='Opportunity']/following::a[1]")), 15000);
        await driver.actions().click(navigate_to_opp).perform();
    }
    catch(e) {
        console.log('Navigate to opp failed!' + e);
    }
    
    let decommission_details = await driver.findElement(By.xpath("//span[.='Secondary Decommission Reason']"));
    driver.executeScript("arguments[0].scrollIntoView();", decommission_details);
    await driver.sleep(2000);

    // check the finance checklist complete
    try {
        let edit_fcc = await driver.wait(until.elementLocated(By.xpath("(//span[.='Finance Checklist Complete'])[last()]/following::button[1]/span[1]")), 15000);
        await driver.sleep(2000);
        await driver.actions().click(edit_fcc).perform();
        await driver.sleep(2000);

        let finance_checkbox = driver.wait(until.elementLocated(By.xpath("//input[@name='Finance_Checklist_Complete__c']")), 15000);
        await driver.actions().click(finance_checkbox).perform();
        await driver.sleep(2000);

        let save = await driver.wait(until.elementLocated(By.xpath("//button[@name='SaveEdit']")), 15000);
        await driver.actions().click(save).perform();
    }
    catch(e) {
        console.log('Check finance checklist complete failed!' + e);
    }
    // let approvals_sd = await driver.findElement(By.xpath("(//span[.='Approvals'])[1]"));
    // driver.executeScript("arguments[0].scrollIntoView();", approvals_sd);

    // try {
    //     let edit_paymentType = await driver.wait(until.elementLocated(By.xpath("(//span[.='Payment Type'])[last()]/following::button[1]/span[1]")), 15000);
    //     await driver.sleep(2000);
    //     await driver.actions().click(edit_paymentType).perform();
    //     await driver.sleep(2000);

    //     let payment_type = driver.wait(until.elementLocated(By.xpath("//label[.='Payment Type']/following::input[1]")), 15000);
    //     await driver.actions().click(payment_type).perform();
    //     await driver.sleep(2000);

    //     let salesComplete = driver.wait(until.elementLocated(By.xpath("//lightning-base-combobox-item[.='PO']")), 15000);
    //     await driver.actions().click(salesComplete).perform();
    //     await driver.sleep(2000);

    //     let save = await driver.wait(until.elementLocated(By.xpath("//button[@name='SaveEdit']")), 15000);
    //     await driver.actions().click(save).perform();
    //     await driver.sleep(2000);
    //     console.log('Payment type populated!')
    // }
    // catch (e) {
    //     console.log('Population of payment type failed!' + e);
    // }
    // // navigate to opp
    // try {
    //     await driver.wait(until.elementLocated(By.xpath("//span[.='Opportunity']/following::a[1]")), 15000).click();
    // }
    // catch(e) {
    //     console.log('Navigate to opp failed!' + e);
    // }

    // // scroll down
    // let key_fields = await driver.findElement(By.xpath("//*[.='Key Fields']"));
    // driver.executeScript("arguments[0].scrollIntoView();", key_fields);
    // await driver.sleep(2000);

    // // set stage to sales complete
    // try {
    //     let edit_stage = await driver.wait(until.elementLocated(By.xpath("(//span[.='Stage'])[last()]/following::button[2]/span")), 15000);
    //     await driver.sleep(2000);
    //     await driver.actions().click(edit_stage).perform();
    //     await driver.sleep(2000);

    //     // await driver.wait(until.elementLocated(By.xpath("(//span[.='Stage'])[last()]/following::button[2]")), 15000).click();
    //     let stage = driver.wait(until.elementLocated(By.xpath("(//label[contains(text(), 'Stage')])[1]/following::input[1]")), 15000);
    //     await driver.actions().click(stage).perform();
    //     await driver.sleep(2000);

    //     let salesComplete = driver.wait(until.elementLocated(By.xpath("//lightning-base-combobox-item[@data-value='Sales Complete']")), 15000);
    //     await driver.actions().click(salesComplete).perform();
    //     await driver.sleep(2000);

    //     let save = await driver.wait(until.elementLocated(By.xpath("//button[@name='SaveEdit']")), 15000);
    //     await driver.actions().click(save).perform();
    //     await driver.sleep(2000);

    //     let cancel = await driver.wait(until.elementLocated(By.xpath("//button[@name='CancelEdit']")), 15000);
    //     await driver.actions().click(cancel).perform();
    //     await driver.sleep(2000);
    // }
    // catch(e) {
    //     console.log('Set stage failed!' + e);
    // }

    // // scroll down
    // let decommission_details = await driver.findElement(By.xpath("//span[.='Decommission Details']"));
    // driver.executeScript("arguments[0].scrollIntoView();", decommission_details);
    // await driver.sleep(2000);

    // // check the finance checklist complete
    // try {
    //     let edit_fcc = await driver.wait(until.elementLocated(By.xpath("(//span[.='Finance Checklist Complete'])[last()]/following::button[1]/span[1]")), 15000);
    //     await driver.sleep(2000);
    //     await driver.actions().click(edit_fcc).perform();
    //     await driver.sleep(2000);

    //     let finance_checkbox = driver.wait(until.elementLocated(By.xpath("//input[@name='Finance_Checklist_Complete__c']")), 15000);
    //     await driver.actions().click(finance_checkbox).perform();
    //     await driver.sleep(2000);

    //     let save = await driver.wait(until.elementLocated(By.xpath("//button[@name='SaveEdit']")), 15000);
    //     await driver.actions().click(save).perform();
    // }
    // catch(e) {
    //     console.log('Check finance checklist complete failed!' + e);
    // }


    
    // // how to use date object
    // const dateee = new Date("2021-03-01");
    // dateee.setDate(dateee.getDate() + 1);
    // console.log(dateee);
    // console.log(dateee.toLocaleDateString("en-US"));
}


const args = process.argv.slice(2);
QLE_Test();

// console.log(typeof(x.toString()));
// args.forEach(arg => {
//     console.log(arg);
//     quotesTest(arg);
// });

// a0p1I0000097Y3lQAE


// if failed, log out
// continue?