import { Page, Locator, expect } from '@playwright/test';

export interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId?: string;
  designationId?: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'HOURLY' | string;
  baseSalary?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  taxId?: string;
  nationalId?: string;
  pinCode?: string;
}

export interface LeaveRequestData {
  employeeName?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
}

export interface SalaryAdvanceData {
  employeeName?: string;
  loanAmount: string;
  monthlyDeduction: string;
  notes?: string;
}

export interface SalaryRuleData {
  name: string;
  componentType?: string; // Allowance / Deduction
  amountType?: string; // Flat / Percentage
  amountValue?: string;
  description?: string;
}

export interface PayrollRunData {
  payrollTitle?: string;
  periodStart?: string;
  periodEnd?: string;
}

export class HRPage {
  readonly page: Page;

  // Header & KPI Metrics
  readonly pageHeading: Locator;
  readonly totalEmployeesCard: Locator;
  readonly activeStaffCard: Locator;

  // Segmented Navigation Tabs
  readonly employeesTab: Locator;
  readonly timesheetsTab: Locator;
  readonly leaveApprovalsTab: Locator;
  readonly salaryAdvancesTab: Locator;
  readonly salaryRulesTab: Locator;
  readonly policySettingsTab: Locator;
  readonly runPayrollTab: Locator;

  // Employee Directory Controls
  readonly employeeSearchInput: Locator;
  readonly departmentFilterSelect: Locator;
  readonly typeFilterSelect: Locator;
  readonly departmentsBtn: Locator;
  readonly designationsBtn: Locator;
  readonly addEmployeeBtn: Locator;
  readonly employeeTableRows: Locator;

  // Add Employee Modal Form Fields (100% Comprehensive Coverage)
  readonly employeeModal: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly departmentSelect: Locator;
  readonly designationSelect: Locator;
  readonly employmentTypeSelect: Locator;
  readonly baseSalaryInput: Locator;
  readonly bankAccountInput: Locator;
  readonly bankRoutingInput: Locator;
  readonly taxIdInput: Locator;
  readonly nationalIdInput: Locator;
  readonly pinCodeInput: Locator;
  readonly saveEmployeeBtn: Locator;
  readonly cancelEmployeeBtn: Locator;

  // Timesheets Tab Controls
  readonly addTimecardBtn: Locator;
  readonly timesheetStartDateInput: Locator;
  readonly timesheetEndDateInput: Locator;
  readonly todayFilterBtn: Locator;
  readonly last30DaysFilterBtn: Locator;

  // Leave Approvals Controls
  readonly newLeaveRequestBtn: Locator;

  // Salary Advances Controls
  readonly issueSalaryAdvanceBtn: Locator;
  readonly salaryAdvanceTableRows: Locator;

  // Salary Rules Controls
  readonly newComponentBtn: Locator;

  // Run Payroll Controls
  readonly runPayrollEngineBtn: Locator;
  readonly payrollTitleInput: Locator;
  readonly payrollStartDateInput: Locator;
  readonly payrollEndDateInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header & KPI
    this.pageHeading = page.locator('h1, h2, div').filter({ hasText: 'HR & Payroll Management' }).first();
    this.totalEmployeesCard = page.locator('div, span').filter({ hasText: 'TOTAL EMPLOYEES' }).first();
    this.activeStaffCard = page.locator('div, span').filter({ hasText: 'ACTIVE STAFF' }).first();

    // Tabs
    this.employeesTab = page.locator('button:has-text("Employees")').first();
    this.timesheetsTab = page.locator('button:has-text("Timesheets & Overrides")').first();
    this.leaveApprovalsTab = page.locator('button:has-text("Leave Approvals")').first();
    this.salaryAdvancesTab = page.locator('button:has-text("Salary Advances")').first();
    this.salaryRulesTab = page.locator('button:has-text("Salary Rules")').first();
    this.policySettingsTab = page.locator('button:has-text("HR Policy Settings")').first();
    this.runPayrollTab = page.locator('button:has-text("Run Payroll")').first();

    // Employee List Controls
    this.employeeSearchInput = page.locator('input[placeholder*="Search employees"]');
    this.departmentFilterSelect = page.locator('select.filter-select').first();
    this.typeFilterSelect = page.locator('select.filter-select').nth(1);
    this.departmentsBtn = page.locator('button:has-text("Departments")').first();
    this.designationsBtn = page.locator('button:has-text("Designations")').first();
    this.addEmployeeBtn = page.locator('button:has-text("Add Employee")').first();
    this.employeeTableRows = page.locator('tbody tr');

    // Add Employee Modal
    this.employeeModal = page.locator('div[class*="modal"], div.fixed').first();
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.departmentSelect = page.locator('select[name="departmentId"]');
    this.designationSelect = page.locator('select[name="designationId"]');
    this.employmentTypeSelect = page.locator('select[name="employmentType"]');
    this.baseSalaryInput = page.locator('input[name="baseSalary"]');
    this.bankAccountInput = page.locator('input[name="bankAccountNumber"]');
    this.bankRoutingInput = page.locator('input[name="bankRoutingNumber"]');
    this.taxIdInput = page.locator('input[name="taxId"]');
    this.nationalIdInput = page.locator('input[name="nationalId"]');
    this.pinCodeInput = page.locator('input[name="pinCode"]');
    this.saveEmployeeBtn = page.locator('button:has-text("Save Employee")').last();
    this.cancelEmployeeBtn = page.locator('button:has-text("Cancel")').last();

    // Timesheets
    this.addTimecardBtn = page.locator('button:has-text("Add Timecard")').first();
    this.timesheetStartDateInput = page.locator('input[type="date"]').first();
    this.timesheetEndDateInput = page.locator('input[type="date"]').nth(1);
    this.todayFilterBtn = page.locator('button:has-text("Today")').first();
    this.last30DaysFilterBtn = page.locator('button:has-text("Last 30 Days")').first();

    // Leave Approvals
    this.newLeaveRequestBtn = page.locator('button:has-text("New Leave Request")').first();

    // Salary Advances
    this.issueSalaryAdvanceBtn = page.locator('button:has-text("Issue Salary Advance")').first();
    this.salaryAdvanceTableRows = page.locator('tbody tr');

    // Salary Rules
    this.newComponentBtn = page.locator('button:has-text("New Component")').first();

    // Run Payroll
    this.runPayrollEngineBtn = page.locator('button:has-text("Run Payroll Engine")').first();
    this.payrollTitleInput = page.locator('input[placeholder*="Payroll"]').first();
    this.payrollStartDateInput = page.locator('input[type="date"]').first();
    this.payrollEndDateInput = page.locator('input[type="date"]').nth(1);
  }

  async goto() {
    await this.page.goto('/owner/hr');
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // --- Tab Navigation Methods ---
  async switchToEmployees() {
    await this.employeesTab.click();
    await this.page.waitForTimeout(1500);
  }

  async switchToTimesheets() {
    await this.timesheetsTab.click();
    await this.page.waitForTimeout(1500);
  }

  async switchToLeaveApprovals() {
    await this.leaveApprovalsTab.click();
    await this.page.waitForTimeout(1500);
  }

  async switchToSalaryAdvances() {
    await this.salaryAdvancesTab.click();
    await this.page.waitForTimeout(1500);
  }

  async switchToSalaryRules() {
    await this.salaryRulesTab.click();
    await this.page.waitForTimeout(1500);
  }

  async switchToPolicySettings() {
    await this.policySettingsTab.click();
    await this.page.waitForTimeout(1500);
  }

  async switchToRunPayroll() {
    await this.runPayrollTab.click();
    await this.page.waitForTimeout(1500);
  }

  // --- Employee Directory Methods ---
  async searchEmployee(query: string) {
    await this.employeeSearchInput.fill(query);
    await this.page.waitForTimeout(1000);
  }

  async clearEmployeeSearch() {
    await this.employeeSearchInput.fill('');
    await this.page.waitForTimeout(1000);
  }

  async filterByEmploymentType(typeLabel: string) {
    if (await this.typeFilterSelect.isVisible()) {
      await this.typeFilterSelect.selectOption({ label: typeLabel }).catch(async () => {
        await this.typeFilterSelect.selectOption(typeLabel).catch(() => {});
      });
      await this.page.waitForTimeout(1000);
    }
  }

  async filterByDepartment(deptLabel: string) {
    if (await this.departmentFilterSelect.isVisible()) {
      await this.departmentFilterSelect.selectOption({ label: deptLabel }).catch(async () => {
        await this.departmentFilterSelect.selectOption(deptLabel).catch(() => {});
      });
      await this.page.waitForTimeout(1000);
    }
  }

  async openAddEmployeeModal() {
    await this.addEmployeeBtn.click();
    await this.page.waitForTimeout(1500);
    await expect(this.employeeModal).toBeVisible();
  }

  async fillCompleteEmployeeForm(data: EmployeeData) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);

    // Select Department if provided or select first available non-empty option
    if (await this.departmentSelect.isVisible()) {
      const options = await this.departmentSelect.locator('option').all();
      if (options.length > 1) {
        if (data.departmentId) {
          await this.departmentSelect.selectOption(data.departmentId).catch(async () => {
            await this.departmentSelect.selectOption({ index: 1 });
          });
        } else {
          await this.departmentSelect.selectOption({ index: 1 });
        }
      }
    }

    // Select Designation if provided or select first available option
    if (await this.designationSelect.isVisible()) {
      const options = await this.designationSelect.locator('option').all();
      if (options.length > 1) {
        if (data.designationId) {
          await this.designationSelect.selectOption(data.designationId).catch(async () => {
            await this.designationSelect.selectOption({ index: 1 });
          });
        } else {
          await this.designationSelect.selectOption({ index: 1 });
        }
      }
    }

    // Employment Type
    if (data.employmentType && await this.employmentTypeSelect.isVisible()) {
      await this.employmentTypeSelect.selectOption(data.employmentType).catch(async () => {
        await this.employmentTypeSelect.selectOption({ index: 0 });
      });
    }

    // Financial & Compliance Fields
    if (data.baseSalary) await this.baseSalaryInput.fill(data.baseSalary);
    if (data.bankAccountNumber) await this.bankAccountInput.fill(data.bankAccountNumber);
    if (data.bankRoutingNumber) await this.bankRoutingInput.fill(data.bankRoutingNumber);
    if (data.taxId) await this.taxIdInput.fill(data.taxId);
    if (data.nationalId) await this.nationalIdInput.fill(data.nationalId);
    if (data.pinCode) await this.pinCodeInput.fill(data.pinCode);
  }

  async submitEmployeeModal() {
    await this.saveEmployeeBtn.click();
    await this.page.waitForTimeout(3000);
  }

  async cancelEmployeeModal() {
    await this.cancelEmployeeBtn.click();
    await this.page.waitForTimeout(1000);
  }

  // --- Timesheets Methods ---
  async setTimesheetDateRange(startDate: string, endDate: string) {
    if (await this.timesheetStartDateInput.isVisible()) {
      await this.timesheetStartDateInput.fill(startDate);
    }
    if (await this.timesheetEndDateInput.isVisible()) {
      await this.timesheetEndDateInput.fill(endDate);
    }
    await this.page.waitForTimeout(1500);
  }

  // --- Salary Advances Methods ---
  async openIssueSalaryAdvanceModal() {
    await this.issueSalaryAdvanceBtn.click();
    await this.page.waitForTimeout(1500);
  }

  // --- Salary Rules Methods ---
  async openNewSalaryComponentModal() {
    await this.newComponentBtn.click();
    await this.page.waitForTimeout(1500);
  }

  // --- Run Payroll Methods ---
  async executePayrollRun(title: string, startDate?: string, endDate?: string) {
    if (await this.payrollTitleInput.isVisible()) {
      await this.payrollTitleInput.fill(title);
    }
    if (startDate && await this.payrollStartDateInput.isVisible()) {
      await this.payrollStartDateInput.fill(startDate);
    }
    if (endDate && await this.payrollEndDateInput.isVisible()) {
      await this.payrollEndDateInput.fill(endDate);
    }
    await this.runPayrollEngineBtn.click();
    await this.page.waitForTimeout(3000);
  }
}
