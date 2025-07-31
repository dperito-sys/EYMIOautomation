// @ts-check
// import module from other directory
import dotenv from 'dotenv';
dotenv.config();

import { test, expect } from '@playwright/test';
import { addResult } from '../utils/testrail-util';

// console.log ('SUPERADMIN', process.env.SUPERADMIN);
// console.log('PASSWORD', process.env.PASSWORD);

test.beforeEach(async ({ page }) => {
    const superadmin = process.env.SUPERADMIN || '';
    const password = process.env.PASSWORD || '';

    await page.goto('https://staging-io-web.excelym.com/');
    //wait for page to have title
    await expect(page).toHaveTitle(/NetSuite/);
    await page.fill('#email', superadmin);
    await page.fill('#password', password);
    await page.getByRole('button', { name: 'Login' }).click();
    //wait for the integration nav bar displays
    await expect(page.locator('#TopNavBar > div.float-left > a')).toContainText('Excelym');
});

test.describe('Execute an Integration Manually', () => {
    test('C211 - Run Shopify Customers to NetSuite Customers manually', async ({ page }) => {

        const caseId = 211;

        try {
            const dialog = page.locator('div').filter({
                hasText: /^ShopifyCustomerToNSCustomer has been successfully added to job-queue\.$/
            });

            await page.getByRole('link', { name: 'Integrations' }).click();
            await page.getByRole('textbox', { name: 'Search name' }).click();
            await page.getByRole('textbox', { name: 'Search name' }).fill('ShopifycustomertoNScustomer');
            await page.getByRole('link', { name: 'ShopifyCustomerToNSCustomer' }).click();
            await page.getByRole('button', { name: ' Execute Task' }).click();

            // Wait for the confirmation dialogue to display
            await expect(dialog).toBeVisible({ timeout: 5000 });

            await addResult(caseId, 1, 'Integration executed successfully ✅');

        } catch (err) {
            await addResult(caseId, 5, `Integration failed ❌: ${err.message}`);
            throw err;
        }

    });
});
