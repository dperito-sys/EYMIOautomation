// @ts-check
import dotenv from 'dotenv';
dotenv.config();

import { test, expect } from '@playwright/test';
import { addResult } from '../utils/testrail-util';
import { TIMEOUT } from 'dns';

console.log('SUPERADMIN', process.env.SUPERADMIN);
console.log('PASSWORD', process.env.PASSWORD);


test.beforeEach(async ({ page }) => {
    const superadmin = process.env.SUPERADMIN || '';
    const password = process.env.PASSWORD || '';

    await page.goto('https://staging-io-web.excelym.com/');

    await expect(page).toHaveTitle(/NetSuite/);
    // wait for page to have title
    await page.fill('#email', superadmin);
    await page.fill('#password', password);
    await page.getByRole('button', { name: 'Login' }).click();
    // wait for the integration nav bar displays
    await expect(page.locator('#TopNavBar > div.float-left > a')).toContainText('Excelym');
});

test.describe('Test Connection', () => {
    test('C197 - Test NetSuite Token Based Connection', async ({ page }) => {

        const caseId = 197;

        try {
            // await page.pause();
            await page.getByRole('button', { name: 'Maintenance' }).hover();
            await page.getByRole('link', { name: 'Connections' }).click();
            // wait for Connections nav bar display
            await expect(page.locator('#endpoint-label-wrapper')).toContainText('Connections');

            await page.getByRole('link', { name: 'NetsuiteTokenBased', exact: true }).click();
            await page.getByRole('button', { name: 'Test Connection' }).click();
            // confirmation dialog should display
            await expect(page.getByText('Connection Successful.')).toBeVisible({ timeout: 5000 });

            await addResult(caseId, 1, 'Integration executed successfully ✅');

        } catch (err) {
            await addResult(caseId, 5, `Integration failed ❌: ${err.message}`);
            throw err;
        }
    });
});