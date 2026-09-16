import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HRPage } from '../pages/HRPage';

test.describe('HR & Payroll Module - Salary Advances, Salary Rules, Policy Settings & Payroll Engine', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('anicafeqr@gmail.com', '123456');
  });

  test('TC-10: Salary Advances Ledger & Table Header Verification', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.switchToSalaryAdvances();

    // Verify Issue Salary Advance action button
    await expect(hrPage.issueSalaryAdvanceBtn).toBeVisible();

    // Wait for table / ledger content
    await page.waitForTimeout(2000);
    const headers = await page.locator('table th').allInnerTexts();
    console.log('Salary Advance Table Headers:', headers);

    const pageText = await page.innerText('main, body');
    expect(pageText).toContain('Salary Advance');

    await page.screenshot({ path: 'test-results/tc10-salary-advances-ledger.png', fullPage: true });
  });

  test('TC-11: Issue Salary Advance Workflow Modal & Form Fields Verification', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.switchToSalaryAdvances();
    await hrPage.openIssueSalaryAdvanceModal();

    const modal = page.locator('div[class*="modal"], div.fixed').first();
    await expect(modal).toBeVisible();

    // Verify advance form elements
    const inputs = modal.locator('input, select, textarea');
    expect(await inputs.count()).toBeGreaterThanOrEqual(1);

    await page.screenshot({ path: 'test-results/tc11-issue-advance-modal.png' });

    // Close modal
    const cancelBtn = modal.locator('button:has-text("Cancel"), button[class*="close"]').last();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    }
  });

  test('TC-12: Salary Rules & Compensation Components Setup Verification', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.switchToSalaryRules();

    // Verify Salary Rules component button and view
    await expect(hrPage.newComponentBtn).toBeVisible();

    await hrPage.newComponentBtn.click();
    await page.waitForTimeout(1500);

    const modal = page.locator('div[class*="modal"], div.fixed').first();
    if (await modal.isVisible()) {
      await page.screenshot({ path: 'test-results/tc12-new-salary-component-modal.png' });
      const cancelBtn = modal.locator('button:has-text("Cancel"), button[class*="close"]').last();
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    } else {
      await page.screenshot({ path: 'test-results/tc12-salary-rules-tab.png' });
    }
  });

  test('TC-12b: HR Policy Settings Configuration & Policy Controls Verification', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    console.log('Navigating to HR Policy Settings tab...');
    await hrPage.switchToPolicySettings();

    await expect(hrPage.policySettingsTab).toBeVisible();

    // Verify policy settings configuration controls
    const policyContent = await page.innerText('main, body');
    console.log('HR Policy Settings View loaded successfully.');
    expect(policyContent).toContain('Policy');

    await page.screenshot({ path: 'test-results/tc12b-hr-policy-settings.png', fullPage: true });
  });

  test('TC-13: Run Payroll Engine Execution & Cycle Calculation', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.switchToRunPayroll();

    await expect(hrPage.runPayrollEngineBtn).toBeVisible();

    const timestamp = Date.now().toString().slice(-4);
    const payrollName = `September 2026 Batch ${timestamp}`;

    console.log(`Configuring Payroll Run: ${payrollName}`);
    await hrPage.executePayrollRun(payrollName, '2026-09-01', '2026-09-30');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/tc13-run-payroll-executed.png', fullPage: true });
  });

});
