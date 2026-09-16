import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HRPage } from '../pages/HRPage';
import { PaymentPage } from '../pages/PaymentPage';

test.describe('HR & Payment Modules - Negative Boundaries & Validation Suite', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('anicafeqr@gmail.com', '123456');
  });

  test('TC-19: Mandatory Field Validation on Employee Registration Modal', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.openAddEmployeeModal();

    // Click Save Employee without filling any mandatory fields
    console.log('Submitting empty employee form to verify browser/HTML5 validation...');
    await hrPage.saveEmployeeBtn.click();
    await page.waitForTimeout(1000);

    // Modal should remain open because mandatory fields (e.g. firstName, email) are required
    await expect(hrPage.employeeModal).toBeVisible();

    await page.screenshot({ path: 'test-results/tc19-employee-empty-validation.png' });
    await hrPage.cancelEmployeeModal();
  });

  test('TC-20: Negative & Zero Payment Input Boundary Handling', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.goto();

    await paymentPage.switchToCustomers();
    await paymentPage.openRecordPaymentModal();

    // Attempt filling negative amount
    console.log('Testing negative amount input boundary: -500');
    await paymentPage.fillPaymentDetails({
      amount: '-500',
      method: 'Cash',
      referenceNotes: 'Negative boundary test'
    });

    await page.screenshot({ path: 'test-results/tc20-negative-payment-input.png' });

    // Cancel modal
    await paymentPage.cancelPayment();
    await expect(paymentPage.paymentModal).not.toBeVisible();
  });

  test('TC-21: Non-matching Search Query Resilience in HR & Payment Directories', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    // Non-existent search query in HR
    await hrPage.searchEmployee('NON_EXISTENT_STAFF_XYZ_9999');
    const hrRows = await page.locator('tbody tr').allInnerTexts();
    console.log('HR non-matching search row count:', hrRows.length);

    await page.screenshot({ path: 'test-results/tc21-hr-empty-search.png' });

    // Non-existent search query in Payment settlements
    const paymentPage = new PaymentPage(page);
    await paymentPage.goto();
    await paymentPage.search('UNKNOWN_VENDOR_999999');
    await page.screenshot({ path: 'test-results/tc21-payment-empty-search.png' });
  });

  test('TC-22: Modal Escape & Cancel Button State Integrity Across All Submodules', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    // Test Add Employee Cancel
    await hrPage.openAddEmployeeModal();
    await hrPage.cancelEmployeeModal();
    await expect(hrPage.employeeModal).not.toBeVisible();

    // Test Timesheet Add Timecard Cancel
    await hrPage.switchToTimesheets();
    await hrPage.addTimecardBtn.click();
    await page.waitForTimeout(1000);
    const timecardCancelBtn = page.locator('div[class*="modal"] button:has-text("Cancel"), button[class*="close"]').last();
    if (await timecardCancelBtn.isVisible()) await timecardCancelBtn.click();

    // Test Salary Advance Cancel
    await hrPage.switchToSalaryAdvances();
    await hrPage.issueSalaryAdvanceBtn.click();
    await page.waitForTimeout(1000);
    const advanceCancelBtn = page.locator('div[class*="modal"] button:has-text("Cancel"), button[class*="close"]').last();
    if (await advanceCancelBtn.isVisible()) await advanceCancelBtn.click();

    await page.screenshot({ path: 'test-results/tc22-modal-cancel-integrity.png' });
  });

});
