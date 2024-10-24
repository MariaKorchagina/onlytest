const { Builder, By, until, Key } = require('selenium-webdriver');
const assert = require('assert');

let driver;

async function start() {
    driver = await new Builder().forBrowser('chrome').build();
}

async function verifyFooter(url) {
    try {
        await driver.get(url);

        // Wait until the footer is present, I noticed that sometimes pages take a long time to load (logs from chrome: 5.8 MB resources Finish: 15.61 s) - ideally, the timeout should not be 15 seconds
        let footerElement = await driver.wait(until.elementLocated(By.css('footer')), 15000);

        // Scroll to the footer
        await driver.executeScript('arguments[0].scrollIntoView();', footerElement);

        // Get the text of the footer and assert the expected value
        let footerText = await footerElement.getText();
        assert.strictEqual(footerText, `Начать проект
+7 (495) 740 99 79
hello@only.com.ru
Awwwards
Vkontakte
Telegram
Vimeo
Behance`);

    } catch (err) {
        console.error(`Error verifying footer for ${url}: ${err}`);
    }
}

async function shutDown() {
    await driver.quit();
}

async function main() {
    try {
        await start();
        const urls = [
            "https://only.digital/ru",
            "https://only.digital/projects",
            "https://only.digital/company",
            "https://only.digital/job",
            "https://only.digital/contacts"
        ];

        for (const url of urls) {
            await verifyFooter(url);
        }
    } finally {
        await shutDown();
    }
}

main();