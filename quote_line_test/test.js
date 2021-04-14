import pkg from 'selenium-webdriver';
const {Builder, By, Key, until} = pkg;
import { quotesTest } from '../quote_action_test/test.js';
import 'chromedriver';
import dotenv from 'dotenv';
dotenv.config();

const account = process.env.ACCOUNT;
const password = process.env.PASSWORD;


// Outline - quotelineTest
  // take quoteId, profile, quantity, discount,license_model and driver as parameters
  // check values in the quote page
  // switch to the owner account (change profile)
  // execute the action
  // log out (change profile)
  // check values

export const quotelineTest = async(quoteId, profile, quantity, discount, license_model, driver) => {

    // Open the sandbox
    await (await driver).manage().setTimeouts({ implicit:10000 });
    await driver.get('https://tibcocpq--sandbox.lightning.force.com/lightning/page/home');

    // Log in with email and password
    await driver.findElement(By.css('#email')).sendKeys(account);
    await driver.findElement(By.css('#next')).click();
    await driver.wait(until.elementLocated(By.css('#password'))).sendKeys(password);
    await driver.wait(until.elementLocated(By.css('#taLogin'))).click();

    // Get quote by url (id)
    await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/'+ quoteId + '/view');

    // modify and login with the owner account
    await switchAccount(quoteId, 'login', driver, profile);

    // Check the status of the quote
    try {
        await (await driver.wait(until.elementLocated(By.xpath("//div/span[. = 'Status']/following::lightning-formatted-text")), 20000))
        .getText()
        .then((text) => {
            if (text === 'Draft') {
              console.log("Status checked!");
            }
            else throw new Error('Not a draft quote!');
        });
    }
    catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("//div/span[. = 'Status']/following::lightning-formatted-text")), 20000)).getText();
        console.log("Status checked failed, Status - expected: Draft, value: " + text);
        driver.quit();
    }

    // Get start date, end date Net Amount and Total ACV
    const startDate = await (await driver.wait(until.elementLocated(By.xpath("//div/span[.='Start Date']/following::lightning-formatted-text")), 20000)).getText();
    const endDate = await (await driver.wait(until.elementLocated(By.xpath("//div/span[.='End Date']/following::lightning-formatted-text")), 20000)).getText();
    const net_amount = await (await driver.wait(until.elementLocated(By.xpath("//*[@id='brandBand_2']/div/div/div[1]/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___quote_record_page___sbqq__quote__c___view/forcegenerated-flexipage_quote_record_page_sbqq__quote__c__view_js/record_flexipage-record-page-decorator/div[1]/slot/flexipage-record-home-template-desktop2/div/div[1]/slot/slot/flexipage-component2/slot/records-lwc-highlights-panel/records-lwc-record-layout/forcegenerated-highlightspanel_sbqq__quote__c___0121i000000p2ctqaq___compact___view___recordlayout2/force-highlights2/div[1]/div[2]/slot/slot/force-highlights-details-item[2]/div/p[2]/slot/records-formula-output/slot/lightning-formatted-text")), 20000)).getText();
    const total_ACV = await (await driver.wait(until.elementLocated(By.xpath("//*[@id='brandBand_2']/div/div/div[1]/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___quote_record_page___sbqq__quote__c___view/forcegenerated-flexipage_quote_record_page_sbqq__quote__c__view_js/record_flexipage-record-page-decorator/div[1]/slot/flexipage-record-home-template-desktop2/div/div[1]/slot/slot/flexipage-component2/slot/records-lwc-highlights-panel/records-lwc-record-layout/forcegenerated-highlightspanel_sbqq__quote__c___0121i000000p2ctqaq___compact___view___recordlayout2/force-highlights2/div[1]/div[2]/slot/slot/force-highlights-details-item[3]/div/p[2]/slot/records-formula-output/slot/lightning-formatted-text")), 20000)).getText();
    console.log("start date: " + startDate);
    console.log("end date: " + endDate);
    console.log("Net Amount: " + net_amount);
    console.log("Total ACV: " + total_ACV);

    // Eidt lines
    try {
        await driver.wait(until.elementLocated(By.xpath("//runtime_platform_actions-action-renderer[@apiname='Edit_Lines']")), 20000)
            .click()
            .then(() => {
                console.log("QLE loading...");
            })
    }
    catch (e) {
        console.log(e);
        driver.quit();
    }

    // Switch iframe
    // await driver.wait(until.ableToSwitchToFrame(By.xpath("//iframe")), 20000);
    const frame = await driver.wait(until.elementLocated(By.xpath("//iframe")),20000);
    await (await driver).switchTo().frame(frame);

    // Check add product button
    try {
        await driver.wait(until.elementLocated(By.xpath("//div[@id='buttons']/div[@id='actions']/sb-custom-action[@name='Add Products']/paper-button")), 30000);
    }
    catch (e) {
        console.log(e);
        driver.quit();
    }

    // Validate start date and end date
    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@tooltip='Start Date']/following::input[@id='selectedDate'])[1]")), 20000))
            .getAttribute('value')
            .then((text) => {
                const sdate = new Date(text);
                sdate.setDate(sdate.getDate() + 1);
                if (sdate.toLocaleDateString("en-US") === startDate) {
                    console.log("Start Date checked!");
                }
                else throw new Error('Start Date does not match!');
            });
    }
    catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("(//div[@tooltip='Start Date']/following::input[@id='selectedDate'])[1]")), 20000)).getAttribute('value');
        console.log("Start Date checked failed, Start Date - expected: " + startDate + ", value: " + text);
        driver.quit();
    }

    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@tooltip='End Date']/following::input[@id='selectedDate'])[1]")), 20000))
        .getAttribute('value')
        .then((text) => {
            const edate = new Date(text);
            edate.setDate(edate.getDate() + 1);
            if (edate.toLocaleDateString("en-US") === endDate) {
              console.log("End Date checked!");
            }
            else throw new Error('End Date does not match!');
        });
    }
    catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("(//div[@tooltip='End Date']/following::input[@id='selectedDate'])[1]")), 20000)).getAttribute('value');
        console.log("End Date checked failed, End Date - expected: " + endDate + ", value: " + text);
        driver.quit();
    }

    // Click add product button
    await driver.wait(until.elementLocated(By.xpath("//sb-custom-action[@name='Add Products']/paper-button")), 15000)
        .click()
        .then(() => {
            console.log("Loading products...");
        })
    
    // Check select button
    try {
        await driver.wait(until.elementLocated(By.xpath("//paper-button[@id='plSelect']")), 30000);
    }
    catch (e) {
        console.log(e);
        driver.quit();
    }

    // Pick up the first product with License Model "Subscription"
    try {
        await driver.wait(until.elementLocated(By.xpath("(//sb-table-cell[@item='Product2.License_Model__c']/div/sb-field/span/div/span[.='" + license_model + "'])[1]/preceding::div[@id='checkboxContainer'][1]")), 30000).click();
    }
    catch (e) {
        console.log("No product with License Model " + "\"" +license_model + "\"" + "!");
        console.log(e);
        driver.quit();
    }

    // Get price and name
    const price = await (await driver.wait(until.elementLocated(By.xpath("(//sb-table-cell[@item='Product2.License_Model__c']/div/sb-field//span/div/span[.='" + license_model + "'])[1]/following::sb-table-cell[@item='UnitPrice'][1]")), 20000)).getText();
    const name = await (await driver.wait(until.elementLocated(By.xpath("(//sb-table-cell[@item='Product2.License_Model__c']/div/sb-field//span/div/span[.='" + license_model + "'])[1]/preceding::span[@id='me'][1]")), 20000)).getText();
    console.log("Price: " + price);
    console.log("Name: " + name);

    // Click "Select"
    await (await driver.wait(until.elementLocated(By.xpath("//paper-button[@id='plSelect']")),20000)).click();

    // Check save button
    try {
        await driver.wait(until.elementLocated(By.xpath("//sb-custom-action/paper-button[text()='Save']")), 15000)
    }
    catch (e) {
        console.log(e);
        driver.quit();
    }

    // index (Perpetual License)
    let index = 'last()';
    if (license_model === 'Perpetual License') index = 'last()-1';
    // Get net tatal
    const net_total = await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Net_Total_Bundle__c'])[" + index + "]/div")), 20000)).getText();

    // Validate name
    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='SBQQ__ProductName__c'])[" + index + "]/div/span[last()]")), 20000))
            .getText()
            .then((text) => {
                const v1 = text.split(' - ');
                const v2 = v1[0].replace('™', '');
                const v3 = name.replace('™', '');
                const v4 = name.replace('™', ' ');
                if (v2 === v3 || v2 === v4) {
                    console.log("Product Name checked!");
                }
                else throw new Error('Product Name does not match!');
            });
    }
    catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='SBQQ__ProductName__c'])[" + index + "]/div/span[last()]")), 20000)).getText();
        console.log("Product Name checked failed, Product Name - expected: " + name + ", value: " + text);
        driver.quit();
    }

    // Validate unit price
    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Base_Unit_Price__c'])[" + index + "]/div")), 20000))
            .getText()
            .then((text) => {
                if (text === price) {
                    console.log("Product Price checked!");
                }
                else throw new Error('Product Price does not match!');
            });
    }
    catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Uplifted_Customer_Base_Total__c'])[" + index + "]/div")), 20000)).getText();
        console.log("Product Price checked failed before calculation, Product Price - expected: " + price + ", value: " + text);
        driver.quit();
    }

    // Input the quantity
    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Custom_Quantity__c'])[" + index + "]")), 20000)).click();
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Custom_Quantity__c'])[" + index + "]")), 20000)).click();
        await driver.wait(until.elementLocated(By.xpath("(//div[@field='Custom_Quantity__c'])[" + index + "]/div/div/sb-input/input")), 20000)
            .sendKeys(quantity)
            .then(console.log("Input the quantity: " + quantity));
    }
    catch(e) {
        console.log("Update quantity failed!");
        console.log(e);
        // driver.quit();
    }

    // Input the discount
    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='SBQQ__AdditionalDiscount__c'])[" + index + "]")), 20000)).click();
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='SBQQ__AdditionalDiscount__c'])[" + index + "]")), 20000)).click();
        await driver.wait(until.elementLocated(By.xpath("(//div[@field='SBQQ__AdditionalDiscount__c'])[" + index + "]/div/div/sb-discount/sb-input/input")), 20000)
            .sendKeys(discount)
            .then(console.log("Input the discount: " + discount));
    }
    catch(e) {
        console.log("Update discount failed!");
        console.log(e);
        // driver.quit();
    }

// Cancel a renewed line

    // Find the first renewed line & Change the quantity to 0
    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Line_Status__c']/div[.='Renewed'])[1]/following::div[@field='Custom_Quantity__c'][1]")), 20000)).click();
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Line_Status__c']/div[.='Renewed'])[1]/following::div[@field='Custom_Quantity__c'][1]")), 20000)).click();
        await driver.wait(until.elementLocated(By.xpath("(//div[@field='Line_Status__c']/div[.='Renewed'])[1]/following::div[@field='Custom_Quantity__c'][1]/div/div/sb-input/input")), 20000)
            .sendKeys('0')
            .then(console.log("The first renewed line cancelled!"));
    }
    catch(e) {
        console.log("Cancellation failed!");
        console.log(e);
        // driver.quit();
    }


    // Click calculate
    await driver.wait(until.elementLocated(By.xpath("//sb-custom-action/paper-button[text()='Calculate']")), 15000)
        .click()
        .then(console.log("Calculating..."));

    // Validate net total after the calculation
    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Net_Total_Bundle__c'])[" + index + "]/div")), 20000))
            .getText()
            .then((text) => {
                const nums_before = net_total.split(" ")[1].split(",");
                const nums_after = text.split(" ")[1].split(",");
                let net_total_before = '';
                let net_total_after = '';
                nums_before.forEach(num => net_total_before += num)
                nums_after.forEach(num => net_total_after += num)
                let total1 = (((100-discount)/100 * net_total_before) * quantity).toFixed(2);
                let total2 = parseFloat(net_total_after).toFixed(2);
                console.log(total1);
                console.log(total2);
                if (Math.abs(total1 - total2) < 1) {
                    console.log("Net total checked after calculation!");
                    console.log("Net total - Before: USD " + net_total_before);
                    console.log("Net total - After: USD " + net_total_after);
                }
                else throw new Error('Net total does not match!');
            });
    }
    catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Net_Total_Bundle__c'])[" + index + "]/div")), 20000)).getText();
        const nums_before = net_total.split(" ")[1].split(",");
        const nums_after = text.split(" ")[1].split(",");
        let net_total_before = '';
        let net_total_after = '';
        nums_before.forEach(num => net_total_before += num)
        nums_after.forEach(num => net_total_after += num)
        let total1 = (((100-discount)/100 * net_total_before).toFixed(2) * quantity).toFixed(2);
        let total2 = parseFloat(net_total_after).toFixed(2);
        console.log("Net total check failed after calculation, Net Total - expected: USD " + total1 + ", value: USD " + total2);
        driver.quit();
    }

    // Validate Maintenance if license model is perpetual liscense !!!
    if (license_model === 'Perpetual License') {

    }

    // Validate the red flag
    try {
        const src = await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Approval_Flag__c'])[last()]/div/div/img")), 20000)).getAttribute("src");
        if (src.includes('comfirm')) console.log("Green Flag!");
        if (src.includes('error')) console.log("Red Flag!");
    }
    catch(e) {
        console.log(e);
    }

    // Click save
    await driver.wait(until.elementLocated(By.xpath("//sb-custom-action/paper-button[text()='Save']")), 15000)
        .click()
        .then(console.log("Saving..."));

    // Continue if alert
    try {
        await (await driver.wait(until.elementLocated(By.xpath("//paper-button[@id='continue']")), 15000)).click()
    }
    catch(e) {

    }

    // Wait for data update
    await (await driver).sleep(10000);

    // Validate Net Amount and Total ACV
    // try {
    //     await (await driver.wait(until.elementLocated(By.xpath("//*[@id='brandBand_2']/div/div/div[1]/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___quote_record_page___sbqq__quote__c___view/forcegenerated-flexipage_quote_record_page_sbqq__quote__c__view_js/record_flexipage-record-page-decorator/div[1]/slot/flexipage-record-home-template-desktop2/div/div[1]/slot/slot/flexipage-component2/slot/records-lwc-highlights-panel/records-lwc-record-layout/forcegenerated-highlightspanel_sbqq__quote__c___0121i000000p2ctqaq___compact___view___recordlayout2/force-highlights2/div[1]/div[2]/slot/slot/force-highlights-details-item[2]/div/p[2]/slot/records-formula-output/slot/lightning-formatted-text")), 20000))
    //         .getText()
    //         .then(text => {
    //             const net_amount_num = net_amount.split(" ")[1].split(",");
    //             const total_ACV_num = total_ACV.split(" ")[1].split(",");
    //             let net_amount_before = '';
    //             let total_ACV_before = '';
    //             net_amount_num.forEach(num => net_amount_before += num);
    //             total_ACV_num.forEach(num => total_ACV_before += num);
    //         });
    //     const total_ACV = await (await driver.wait(until.elementLocated(By.xpath("//*[@id='brandBand_2']/div/div/div[1]/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___quote_record_page___sbqq__quote__c___view/forcegenerated-flexipage_quote_record_page_sbqq__quote__c__view_js/record_flexipage-record-page-decorator/div[1]/slot/flexipage-record-home-template-desktop2/div/div[1]/slot/slot/flexipage-component2/slot/records-lwc-highlights-panel/records-lwc-record-layout/forcegenerated-highlightspanel_sbqq__quote__c___0121i000000p2ctqaq___compact___view___recordlayout2/force-highlights2/div[1]/div[2]/slot/slot/force-highlights-details-item[3]/div/p[2]/slot/records-formula-output/slot/lightning-formatted-text")), 20000)).getText();
    
    //     await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Net_Total_Bundle__c'])[" + index + "]/div")), 20000))
    //         .getText()
    //         .then((text) => {
    //             const nums_before = net_total.split(" ")[1].split(",");
    //             const nums_after = text.split(" ")[1].split(",");
    //             let net_total_before = '';
    //             let net_total_after = '';
    //             nums_before.forEach(num => net_total_before += num)
    //             nums_after.forEach(num => net_total_after += num)
    //             let total1 = (((100-discount)/100 * net_total_before) * quantity).toFixed(2);
    //             let total2 = parseFloat(net_total_after).toFixed(2);
    //             console.log(total1);
    //             console.log(total2);
    //             if (Math.abs(total1 - total2) < 1) {
    //                 console.log("Net total checked after calculation!");
    //                 console.log("Net total - Before: USD " + net_total_before);
    //                 console.log("Net total - After: USD " + net_total_after);
    //             }
    //             else throw new Error('Net total does not match!');
    //         });
    // }
    // catch(e) {
    //     const text = await (await driver.wait(until.elementLocated(By.xpath("(//div[@field='Net_Total_Bundle__c'])[" + index + "]/div")), 20000)).getText();
    //     const nums_before = net_total.split(" ")[1].split(",");
    //     const nums_after = text.split(" ")[1].split(",");
    //     let net_total_before = '';
    //     let net_total_after = '';
    //     nums_before.forEach(num => net_total_before += num)
    //     nums_after.forEach(num => net_total_after += num)
    //     let total1 = (((100-discount)/100 * net_total_before).toFixed(2) * quantity).toFixed(2);
    //     let total2 = parseFloat(net_total_after).toFixed(2);
    //     console.log("Net total check failed after calculation, Net Total - expected: USD " + total1 + ", value: USD " + total2);
    //     driver.quit();
    // }

    // Validate Quote Lines (Line Status & Product Name)
    await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/' + quoteId +'/related/SBQQ__LineItems__r/view')
        .then(console.log("Opening Quote Lines"));

    try {
        await (await driver).sleep(5000);
        await (await driver.wait(until.elementLocated(By.xpath("(//tr)[last()-1]/td[2]/span/span")), 20000))
            .getText()
            .then((text) => {
                if (text === 'New') {
                    console.log("Line Status checked!");
                }
                else throw new Error('Line Status does not match!');
            });
    }
    catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("(//tr)[last()-1]/td[2]/span/span")), 20000)).getText();
        console.log("Line Status check failed, Line Status - expected: " + "New" + ", value: " + text);
        driver.quit();
    }

    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//tr)[last()-1]/td[3]/span/span")), 20000))
        .getText()
        .then((text) => {
            const v1 = text.split(' - ');
            const v2 = v1[0].replace('™', '');
            const v3 = name.replace('™', '');
            const v4 = name.replace('™', ' ');
            if (v2 === v3 || v2 === v4) {
              console.log("Product Name checked!");
            }
            else throw new Error('Product Name does not match!');
        });
    }
    catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("(//tr)[last()-1]/td[3]/span/span")), 20000)).getText();
        console.log("Product Name check failed, Product Name - expected: " + name + ", value: " + text);
        driver.quit();
    }
    console.log('Product is added to Quote Lines!');

    // each quote lines - three values!!!
    // await checkEachLine();


    

    // // submit for approval ???
    // await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/'+ quoteId + '/view');
    // await quote_submit(quoteId, driver);

    

    // // check more values
    //     // quote page - Marketplace Integration Stage, Marketplace Integration - Last Updated, Shopify URL
        
    //     try {
    //         await (await driver.wait(until.elementLocated(By.xpath("//div/span[. = 'Marketplace Integration Stage']/following::lightning-formatted-text")), 10000))
    //         .getText()
    //         .then((text) => {
    //             if (text === 'In Progress') {
    //               console.log("!");
    //             }
    //             else throw new Error('Status not checked bofore submission!');
    //         });
    //       }
    //       catch(e) {
    //         const text = await (await driver.wait(until.elementLocated(By.xpath("//div/span[. = 'Status']/following::lightning-formatted-text")), 10000)).getText();
    //         console.log("Status checked failed, Status - expected: Draft or empty, value: " + text);
    //         await driver.quit();
    //         process.exit(1);
    //       }

    // logout and modify the owner account
    // await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/'+ quoteId + '/view');
    // await (await driver).sleep(5000);
    // await switchAccount(quoteId, 'logout', driver);

    // login with the approver

    
    // Approve this quote
    await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/' + quoteId + '/related/Approvals__r/view');
    try {
        await (await driver.wait(until.elementLocated(By.xpath("(//tr/td[4][.='Requested'])[1]/preceding::a[2]")), 20000)).click();
    }
    catch (e) {
        console.log(e);
    }
    await (await driver).sleep(5000);
    try {
        await (await driver.wait(until.elementLocated(By.xpath("//lightning-button/button[.='Approve']")), 20000)).click();
    }
    catch (e) {
        console.log(e);
    }
    await (await driver).sleep(5000);
    try {
        await (await driver.wait(until.elementLocated(By.xpath("//textarea")), 20000)).sendKeys("Approved");
    }
    catch (e) {
        console.log(e);
    }
    await (await driver).sleep(5000);
    // try {
    //     await (await driver.wait(until.elementLocated(By.xpath("//input[@value='Approve']")), 20000)).click();
    // }
    // catch (e) {
    //     console.log(e);
    // }

    await (await driver).sleep(5000);

    // logout approver

    // login with owner user?
    // await switchAccount(quoteId, 'login', driver, profile);

    // check status and recordType
    // try {
    //     await (await driver.wait(until.elementLocated(By.xpath("//div/span[. = 'Status']/following::lightning-formatted-text")), 10000))
    //       .getText()
    //       .then((text) => {
    //           if (text === 'Approved') {
    //               console.log("Status checked - Approved!");
    //           }
    //           else throw new Error('Status not approved!');
    //     });
    // }
    // catch(e) {
    //       const text = await (await driver.wait(until.elementLocated(By.xpath("//div/span[. = 'Status']/following::lightning-formatted-text")), 10000)).getText();
    //       console.log("Status checked failed, Status - expected: Approved, value: " + text);
    //       await driver.quit();
    //       process.exit(1);
    // }
      
    // try {
    //     await driver.wait(until.elementLocated(By.xpath("//span[@force-recordtype_recordtype='']")), 10000)
    //       .getText()
    //       .then(text => {
    //           if (text === 'Approved Quote') {
    //           console.log("Record Type - Approved!");
    //           }
    //           else throw new Error('Record Type not approved!');
    //       });
    // }
    // catch (e) {
    //       const text = await driver.wait(until.elementLocated(By.xpath("//span[@force-recordtype_recordtype='']")), 10000).getText();
    //       console.log("RecordType checked failed, RecordType - expected: Approved Quote, value: " + text);
    //       await driver.quit();
    //       process.exit(1);
    // }

    // each quote lines - three values!!!
    // await checkEachLine();



    // driver.quit();
}

const quote_submit = async(quoteId, driver) => {
    // validate the submit button
      try {
        await driver.wait(until.elementLocated(By.xpath("//button[@name='SBQQ__Quote__c.AASubmit']")), 15000)
      }
      catch (e) {
        console.log("Already Submitted!");
        await driver.quit();
        process.exit(1);
      }
 
      // check status & recordType before submission
      try {
        await (await driver.wait(until.elementLocated(By.xpath("//div/span[. = 'Status']/following::lightning-formatted-text")), 10000))
        .getText()
        .then((text) => {
            if (text === '' || text === 'Draft') {
              console.log("Status checked before submission!");
            }
            else throw new Error('Status not checked bofore submission!');
        });
      }
      catch(e) {
        const text = await (await driver.wait(until.elementLocated(By.xpath("//div/span[. = 'Status']/following::lightning-formatted-text")), 10000)).getText();
        console.log("Status checked failed, Status - expected: Draft or empty, value: " + text);
        await driver.quit();
        process.exit(1);
      }
 
      try {
        await driver.wait(until.elementLocated(By.xpath("//span[@force-recordtype_recordtype='']")), 10000)
        .getText()
        .then(text => {
          if (text === 'Draft Quote') {
            console.log("Record Type checked before submission!");
          }
          else throw new Error('Record Type not checked bofore submission!');
        });
      }
      catch (e) {
        const text = await driver.wait(until.elementLocated(By.xpath("//span[@force-recordtype_recordtype='']")), 10000).getText();
        console.log("RecordType checked failed, RecordType - expected: Draft Quote, value: " + text);
        await driver.quit();
        process.exit(1);
      }
      
      // submit for approval
      await driver.wait(until.elementLocated(By.xpath("//button[@name='SBQQ__Quote__c.AASubmit']")), 15000)
        .click()
        .then(() => {
          console.log("Submitted!");
        })
      
      // check recall button
      try {
        await driver.wait(until.elementLocated(By.xpath("//button[@name='SBQQ__Quote__c.AARecall']")),15000);
      }
      catch (e) {
        console.log("Submission not finish!");
        await driver.quit();
        process.exit(1);
      }
    }

const checkEachLine = async(quoteId) => {
    await driver.get("https://tibcocpq--sandbox.lightning.force.com/lightning/r/" + quoteId + "/related/SBQQ__LineItems__r/view")

}

const switchAccount = async(quoteId, action, driver, profile) => {
    // https://tibcocpq--sandbox.lightning.force.com/lightning/setup/ManageUsers/page?address=/0051I000001y4soQAA?noredirect=1&isUserEntityOverride=1
    if (action === 'login') {
        console.log('Logging in with owner account...')
    }
    else if (action === 'logout') {
        console.log('Logging out from owner account...');
        await driver.wait(until.elementLocated(By.xpath("(//span[@class='uiImage'])[1]")), 20000).click();
        await driver.wait(until.elementLocated(By.xpath("//a[@class='profile-link-label logout uiOutputURL']")), 20000).click();
        await driver.sleep(5000);
        await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/'+ quoteId + '/view');
    }
    await driver.sleep(5000);
    try {
      console.log('Finding Quote Owner...');
      await driver.wait(until.elementLocated(By.xpath("(//span[.='Owner']/following::force-hoverable-link/div/a)[1]/span")), 20000).click();
      await driver.wait(until.elementLocated(By.xpath("//div[@title='User Detail']")), 20000).click();
    }
    catch(e) {
        // const text = await driver.wait(until.elementLocated(By.xpath("//span[@force-recordtype_recordtype='']")), 10000).getText();
        console.log("Finding Owner Failed: " + e);
        await driver.quit();
        process.exit(1);
    }
    
   
    // switch to iframe & eidt
    await driver.sleep(5000);
    await (await driver).switchTo().defaultContent();
    const frame1 = await driver.wait(until.elementLocated(By.xpath("//*[@id='setupComponent']/div[2]/div/div/force-aloha-page/div/iframe")));
    await (await driver).switchTo().frame(frame1);
    let curr_profile = await driver.wait(until.elementLocated(By.xpath("//td[.='Profile']/following::td[1]/a")), 20000).getText();
    if (action === 'login') {
        origin_profile += curr_profile;
    }
    console.log("Origin profile: " + origin_profile);
    await driver.wait(until.elementLocated(By.xpath("//*[@id='topButtonRow']/input[@name='edit']")), 20000).click();
    // sleep
    await (await driver).sleep(5000);
    //switch to iframe & modify profile
    await (await driver).switchTo().defaultContent();
    const frame2 = await driver.wait(until.elementLocated(By.xpath("//*[@id='setupComponent']/div[2]/div/div/force-aloha-page/div/iframe")));
    await (await driver).switchTo().frame(frame2);
    if (action === 'login') {
        // get the origin profile ???
        await driver.wait(until.elementLocated(By.xpath("//*[@id='Profile']")), 20000).sendKeys(profile);
        // await driver.wait(until.elementLocated(By.xpath("//*[@id='Profile']")), 20000).sendKeys('Renewals');
    }
    else if (action === 'logout') {
        // ???
        // await driver.wait(until.elementLocated(By.xpath("//*[@id='Profile']")), 20000).sendKeys('Read Only');
        console.log("Origin profile: " + origin_profile);
        await driver.wait(until.elementLocated(By.xpath("//*[@id='Profile']")), 20000).sendKeys(origin_profile);
    }
   
    // save
    await driver.wait(until.elementLocated(By.xpath("//*[@id='topButtonRow']/input[@name='save']")), 20000).click();
    //switch to iframe & login
    if (action === 'login') {
        await (await driver).sleep(5000);
        await (await driver).switchTo().defaultContent();
        const frame3 = await driver.wait(until.elementLocated(By.xpath("//*[@id='setupComponent']/div[2]/div/div/force-aloha-page/div/iframe")));
        await (await driver).switchTo().frame(frame3);
        await driver.wait(until.elementLocated(By.xpath("//*[@id='topButtonRow']/input[@name='login']")), 20000).click();
        await (await driver).sleep(5000);
        await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/'+ quoteId + '/view');
    }
    else if (action === 'logout') {
        await (await driver).sleep(5000);
        await (await driver).get('https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/'+ quoteId + '/view');
    }
    console.log(action + ' completed!');
    await (await driver).sleep(5000);
}





// node QLE_Test a0p2g000001ZBh8AAG 2 20 Subscription
// node QLE_Test a0p2g000001ZBXrAAO 2 20 Perpetual License
// node QLE_Test a0p2g000001ZBXrAAO 2 20 Maintenance
// a0p1I0000097Y3lQAE

// https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/a0p2g000001ZCetAAG/view
// 154575

// https://tibcocpq--sandbox.lightning.force.com/lightning/r/SBQQ__Quote__c/a0p1I0000097Y3lQAE/view
// 143452

// How to calculate Total ACV
// Cannot edit lines with other accounts
