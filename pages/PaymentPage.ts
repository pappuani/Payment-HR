import { Page, Locator, expect } from '@playwright/test';

export interface CustomerPaymentData {
  customerName?: string;
  amount: string;
  method?: 'Cash' | 'UPI' | 'Card' | 'Net Banking' | string;
  referenceNotes?: string;
}

export interface VendorPaymentData {
  vendorName?: string;
  amount: string;
  method?: 'Cash' | 'UPI' | 'Card' | 'Net Banking' | 'Bank Transfer' | string;
  referenceNotes?: string;
}

export interface NewCustomerData {
  name: string;
  phone: string;
  email?: string;
  creditLimit?: string;
}

export interface NewVendorData {
  company: string;
  contactPerson: string;
  phone: string;
  email?: string;
  gstin?: string;
  creditLimit?: string;
}

export class PaymentPage {
  readonly page: Page;

  // Tabs & Navigation
  readonly customersTab: Locator;
  readonly vendorsTab: Locator;
  readonly searchInput: Locator;
  readonly newCustomerBtn: Locator;
  readonly newVendorBtn: Locator;

  // Metric Cards
  readonly activeCustomersCard: Locator;
  readonly totalOwedCard: Locator;
  readonly totalCreditLifeCard: Locator;

  // Tables
  readonly tableRows: Locator;

  // Record Payment Modal (All Fields)
  readonly paymentModal: Locator;
  readonly paymentAmountInput: Locator;
  readonly paymentMethodSelect: Locator;
  readonly paymentNotesInput: Locator;
  readonly recordPaymentSubmitBtn: Locator;
  readonly paymentModalCancelBtn: Locator;

  // New Customer Modal
  readonly customerNameInput: Locator;
  readonly customerPhoneInput: Locator;
  readonly customerEmailInput: Locator;
  readonly customerCreditLimitInput: Locator;
  readonly saveCustomerBtn: Locator;
  readonly cancelCustomerBtn: Locator;

  // New Vendor Modal
  readonly vendorCompanyInput: Locator;
  readonly vendorContactInput: Locator;
  readonly vendorPhoneInput: Locator;
  readonly vendorEmailInput: Locator;
  readonly vendorGstinInput: Locator;
  readonly vendorCreditLimitInput: Locator;
  readonly saveVendorBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tabs
    this.customersTab = page.getByRole('button', { name: 'Customers' });
    this.vendorsTab = page.getByRole('button', { name: 'Vendors' });
    this.searchInput = page.locator('input[placeholder*="Search by name or phone"]');
    this.newCustomerBtn = page.getByRole('button', { name: 'New Customer' });
    this.newVendorBtn = page.getByRole('button', { name: 'New Vendor' });

    // Metric Cards
    this.activeCustomersCard = page.locator('div, span').filter({ hasText: 'ACTIVE CUSTOMERS' }).first();
    this.totalOwedCard = page.locator('div, span').filter({ hasText: 'TOTAL OWED' }).first();
    this.totalCreditLifeCard = page.locator('div, span').filter({ hasText: 'TOTAL CREDIT LIFE' }).first();

    // Table
    this.tableRows = page.locator('tbody tr');

    // Payment Modal
    this.paymentModal = page.locator('div[class*="modal"], div.fixed').first();
    this.paymentAmountInput = page.locator('input[type="number"], input[placeholder="0.00"]').first();
    this.paymentMethodSelect = page.locator('div[class*="modal"] select, div.fixed select').first();
    this.paymentNotesInput = page.locator('textarea, input[placeholder*="Notes"], input[placeholder*="Reference"]').first();
    this.recordPaymentSubmitBtn = page.locator('button:has-text("Record Payment")').last();
    this.paymentModalCancelBtn = page.locator('button:has-text("Cancel")').last();

    // New Customer Modal
    this.customerNameInput = page.locator('input[placeholder*="Name"]').first();
    this.customerPhoneInput = page.locator('input[placeholder*="Phone"]').first();
    this.customerEmailInput = page.locator('input[placeholder*="Email"]').first();
    this.customerCreditLimitInput = page.locator('input[placeholder*="Limit"]').first();
    this.saveCustomerBtn = page.locator('button:has-text("Save Customer"), button:has-text("Add Customer")').last();
    this.cancelCustomerBtn = page.locator('button:has-text("Cancel")').last();

    // New Vendor Modal
    this.vendorCompanyInput = page.locator('input[name="company"], input[placeholder*="Company"]').first();
    this.vendorContactInput = page.locator('input[name="contactPerson"], input[placeholder*="Contact"]').first();
    this.vendorPhoneInput = page.locator('input[name="phone"], input[placeholder*="Phone"]').nth(1);
    this.vendorEmailInput = page.locator('input[name="email"], input[placeholder*="Email"]').nth(1);
    this.vendorGstinInput = page.locator('input[name="gstin"], input[placeholder*="GSTIN"]').first();
    this.vendorCreditLimitInput = page.locator('input[name="creditLimit"], input[placeholder*="Limit"]').nth(1);
    this.saveVendorBtn = page.locator('button:has-text("Save Vendor"), button:has-text("Add Vendor")').last();
  }

  async goto() {
    await this.page.goto('/owner/credit-settlements');
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async switchToCustomers() {
    await this.customersTab.click();
    await this.page.waitForTimeout(1500);
  }

  async switchToVendors() {
    await this.vendorsTab.click();
    await this.page.waitForTimeout(1500);
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(1000);
  }

  async clearSearch() {
    await this.searchInput.fill('');
    await this.page.waitForTimeout(1000);
  }

  async openRecordPaymentModal(targetName?: string) {
    let row = this.tableRows.first();
    if (targetName) {
      row = this.tableRows.filter({ hasText: targetName }).first();
    }
    const payBtn = row.locator('button.btn-action-pay, button[title*="Pay"], button:has-text("Pay")').first();
    await payBtn.click({ force: true });
    await this.page.waitForTimeout(1500);
    await expect(this.paymentModal).toBeVisible();
  }

  async fillPaymentDetails(data: CustomerPaymentData) {
    if (await this.paymentAmountInput.isVisible()) {
      await this.paymentAmountInput.fill(data.amount);
    }
    if (data.method && await this.paymentMethodSelect.isVisible()) {
      await this.paymentMethodSelect.selectOption({ label: data.method }).catch(async () => {
        await this.paymentMethodSelect.selectOption(data.method).catch(() => {});
      });
    }
    if (data.referenceNotes && await this.paymentNotesInput.isVisible()) {
      await this.paymentNotesInput.fill(data.referenceNotes);
    }
  }

  async submitPayment() {
    await this.recordPaymentSubmitBtn.click({ force: true });
    await this.page.waitForTimeout(3000);
  }

  async cancelPayment() {
    await this.paymentModalCancelBtn.click({ force: true });
    await this.page.waitForTimeout(1000);
  }

  async createNewCustomer(data: NewCustomerData) {
    await this.newCustomerBtn.click({ force: true });
    await this.page.waitForTimeout(1500);

    const inputs = this.page.locator('div[class*="modal"] input, div.fixed input');
    const inputCount = await inputs.count();
    
    if (inputCount >= 1) await inputs.nth(0).fill(data.name);
    if (inputCount >= 2 && data.phone) await inputs.nth(1).fill(data.phone);
    if (inputCount >= 3 && data.email) await inputs.nth(2).fill(data.email);
    if (inputCount >= 4 && data.creditLimit) await inputs.nth(3).fill(data.creditLimit);

    await this.saveCustomerBtn.click({ force: true });
    await this.page.waitForTimeout(3000);
  }
}
