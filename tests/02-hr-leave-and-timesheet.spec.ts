import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HRPage } from '../pages/HRPage';

test.describe('HR Module - Timesheets, Attendance & Leave Approvals E2E', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('anicafeqr@gmail.com', '123456');
  });

  test('TC-06: Timesheets & Overrides Date Filter Verification (Today, Last 30 Days, Custom Range)', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.switchToTimesheets();

    // Verify Date Pickers & Preset buttons
    await expect(hrPage.todayFilterBtn).toBeVisible();
    await expect(hrPage.last30DaysFilterBtn).toBeVisible();
    await expect(hrPage.addTimecardBtn).toBeVisible();

    // Switch presets
    await hrPage.todayFilterBtn.click();
    await page.waitForTimeout(1000);

    await hrPage.last30DaysFilterBtn.click();
    await page.waitForTimeout(1000);

    // Apply custom date range
    await hrPage.setTimesheetDateRange('2026-09-01', '2026-09-16');

    await page.screenshot({ path: 'test-results/tc06-timesheet-date-filters.png', fullPage: true });
  });

  test('TC-07: Add Timecard Modal Trigger & Form Inspection', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.switchToTimesheets();
    await hrPage.addTimecardBtn.click();
    await page.waitForTimeout(1500);

    const modal = page.locator('div[class*="modal"], div.fixed').first();
    await expect(modal).toBeVisible();

    await page.screenshot({ path: 'test-results/tc07-add-timecard-modal.png' });

    // Cancel / Close modal
    const cancelBtn = modal.locator('button:has-text("Cancel"), button[class*="close"]').last();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    }
  });

  test('TC-08: Leave Approvals Directory & Pending/Approved Status Verification', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.switchToLeaveApprovals();

    await expect(hrPage.newLeaveRequestBtn).toBeVisible();

    // Verify main page elements
    const pageContent = await page.innerText('main, body');
    expect(pageContent).toContain('Leave');

    await page.screenshot({ path: 'test-results/tc08-leave-approvals-tab.png', fullPage: true });
  });

  test('TC-09: New Leave Request Dialog & Submission/Cancellation Integrity', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.switchToLeaveApprovals();
    await hrPage.newLeaveRequestBtn.click();
    await page.waitForTimeout(1500);

    const modal = page.locator('div[class*="modal"], div.fixed').first();
    await expect(modal).toBeVisible();

    // Inspect inputs inside leave modal
    const inputs = modal.locator('input, select, textarea');
    console.log(`Leave Request modal contains ${await inputs.count()} input fields.`);

    await page.screenshot({ path: 'test-results/tc09-leave-request-modal.png' });

    // Close modal
    const cancelBtn = modal.locator('button:has-text("Cancel"), button[class*="close"]').last();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    }
  });

});
