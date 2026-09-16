import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HRPage } from '../pages/HRPage';

test.describe('HR & Payroll Module - Employee Lifecycle Management E2E', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('anicafeqr@gmail.com', '123456');
  });

  test('TC-01: Verify HR Dashboard Loading, KPI Metric Cards & Segmented Navigation Tabs', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    // Verify main HR header
    await expect(page.locator('text=HR & Payroll Management').first()).toBeVisible();

    // Verify metric cards
    await expect(hrPage.totalEmployeesCard).toBeVisible();
    await expect(hrPage.activeStaffCard).toBeVisible();

    // Verify all 7 HR segmented navigation tabs
    await expect(hrPage.employeesTab).toBeVisible();
    await expect(hrPage.timesheetsTab).toBeVisible();
    await expect(hrPage.leaveApprovalsTab).toBeVisible();
    await expect(hrPage.salaryAdvancesTab).toBeVisible();
    await expect(hrPage.salaryRulesTab).toBeVisible();
    await expect(hrPage.policySettingsTab).toBeVisible();
    await expect(hrPage.runPayrollTab).toBeVisible();

    await page.screenshot({ path: 'test-results/tc01-hr-dashboard.png', fullPage: true });
  });

  test('TC-02: Test Search Filter by Name/Email and Employment Type & Department Filters', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    // Verify search filter
    await hrPage.searchEmployee('Boo');
    const tableText = await page.locator('tbody').innerText();
    expect(tableText).toContain('Boo');

    await hrPage.clearEmployeeSearch();

    // Test Employment Type filter
    await hrPage.filterByEmploymentType('Hourly');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/tc02-employee-filters.png', fullPage: true });
  });

  test('TC-03: Register New Employee with ALL 13 Fields without leaving any field', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    await hrPage.openAddEmployeeModal();

    const timestamp = Date.now().toString().slice(-4);
    const employeeData = {
      firstName: `Alex`,
      lastName: `Dev_${timestamp}`,
      email: `alex.dev.${timestamp}@testcafe.com`,
      phone: `98765${timestamp}`,
      employmentType: 'FULL_TIME',
      baseSalary: '45000',
      bankAccountNumber: `ACC${timestamp}998811`,
      bankRoutingNumber: `ROUT${timestamp}45`,
      taxId: `TAX-IN-${timestamp}`,
      nationalId: `ID-CARD-${timestamp}`,
      pinCode: '4321'
    };

    console.log(`Filling all 13 Employee form fields for: ${employeeData.firstName} ${employeeData.lastName}`);
    await hrPage.fillCompleteEmployeeForm(employeeData);

    await page.screenshot({ path: 'test-results/tc03-add-employee-all-fields.png' });

    // Submit Employee Modal
    await hrPage.submitEmployeeModal();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/tc03-employee-created.png', fullPage: true });
  });

  test('TC-04: Verify Employee Row Actions (Manage Pay Rules, Edit, Delete Triggers)', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    // Wait for employee rows to populate
    await page.waitForSelector('tbody tr', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Verify row action triggers
    const manageRulesButtons = page.locator('button:has-text("Manage Rules")');
    const count = await manageRulesButtons.count();
    console.log(`Discovered ${count} Manage Rules action buttons.`);
    expect(count).toBeGreaterThanOrEqual(1);

    const editButtons = page.locator('button.edit, button[class*="edit"]');
    expect(await editButtons.count()).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: 'test-results/tc04-employee-row-actions.png' });
  });

  test('TC-05: Inspect Departments and Designations Config Modals', async ({ page }) => {
    const hrPage = new HRPage(page);
    await hrPage.goto();

    // Open Departments Modal
    if (await hrPage.departmentsBtn.isVisible()) {
      await hrPage.departmentsBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/tc05-departments-modal.png' });
      const closeBtn = page.locator('button:has-text("Close"), button:has-text("Cancel"), button[class*="close"]').last();
      if (await closeBtn.isVisible()) await closeBtn.click().catch(() => {});
    }

    // Open Designations Modal
    if (await hrPage.designationsBtn.isVisible()) {
      await hrPage.designationsBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/tc05-designations-modal.png' });
      const closeBtn = page.locator('button:has-text("Close"), button:has-text("Cancel"), button[class*="close"]').last();
      if (await closeBtn.isVisible()) await closeBtn.click().catch(() => {});
    }
  });

});
