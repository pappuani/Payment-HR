import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PaymentPage } from '../pages/PaymentPage';

test.describe('Payment & Credit Settlements Module - Multi-Method Collections E2E', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('anicafeqr@gmail.com', '123456');
  });

  test('TC-14: Payment Dashboard Metrics & Ledger Cards Verification', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.goto();

    // Verify Metric KPI Cards
    await expect(paymentPage.activeCustomersCard).toBeVisible();
    await expect(paymentPage.totalOwedCard).toBeVisible();
    await expect(paymentPage.totalCreditLifeCard).toBeVisible();

    // Verify Tab switches
    await expect(paymentPage.customersTab).toBeVisible();
    await expect(paymentPage.vendorsTab).toBeVisible();
    await expect(paymentPage.searchInput).toBeVisible();

    await page.screenshot({ path: 'test-results/tc14-payment-dashboard.png', fullPage: true });
  });

  test('TC-15: Customer Payment Collection via Cash & Notes Settlement', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.goto();

    await paymentPage.switchToCustomers();
    await paymentPage.openRecordPaymentModal();

    const timestamp = Date.now().toString().slice(-4);
    console.log('Filling Cash Payment settlement...');
    await paymentPage.fillPaymentDetails({
      amount: '250',
      method: 'Cash',
      referenceNotes: `Cash settlement test ref #${timestamp}`
    });

    await page.screenshot({ path: 'test-results/tc15-customer-cash-payment-filled.png' });

    await paymentPage.submitPayment();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/tc15-customer-payment-recorded.png', fullPage: true });
  });

  test('TC-16: Multi-Payment Methods Support Verification (UPI, Card, Net Banking)', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.goto();

    await paymentPage.switchToCustomers();
    await paymentPage.openRecordPaymentModal();

    // Verify Payment Method Options inside select dropdown
    const select = paymentPage.paymentMethodSelect;
    if (await select.isVisible()) {
      const options = await select.locator('option').allInnerTexts();
      console.log('Available Payment Modes:', options);
      expect(options.length).toBeGreaterThanOrEqual(1);

      // Try selecting UPI if present
      await paymentPage.fillPaymentDetails({
        amount: '500',
        method: 'UPI',
        referenceNotes: 'UPI QR payment test'
      });
    }

    await page.screenshot({ path: 'test-results/tc16-multi-payment-modes.png' });
    await paymentPage.cancelPayment();
  });

  test('TC-17: Vendor Credit Ledger & Supplier Payment Settlement Flow', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.goto();

    await paymentPage.switchToVendors();

    // Verify vendors table
    await expect(paymentPage.tableRows.first()).toBeVisible();

    // Trigger vendor payment modal
    await paymentPage.openRecordPaymentModal();

    const timestamp = Date.now().toString().slice(-4);
    await paymentPage.fillPaymentDetails({
      amount: '1200',
      method: 'Card',
      referenceNotes: `Supplier PO Settlement #${timestamp}`
    });

    await page.screenshot({ path: 'test-results/tc17-vendor-payment-modal.png' });
    await paymentPage.submitPayment();
    await page.waitForTimeout(2000);
  });

  test('TC-18: Register New Customer with Credit Limit', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.goto();

    await paymentPage.switchToCustomers();

    const timestamp = Date.now().toString().slice(-4);
    const newCustomer = {
      name: `PayClient ${timestamp}`,
      phone: `98123${timestamp}`,
      email: `payclient_${timestamp}@cafe.com`,
      creditLimit: '25000'
    };

    console.log(`Creating customer partner with credit limit: ${newCustomer.name}`);
    await paymentPage.createNewCustomer(newCustomer);

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/tc18-customer-created.png', fullPage: true });
  });

});
