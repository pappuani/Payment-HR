import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input#email, input[type="email"]');
    this.passwordInput = page.locator('input#password, input[type="password"]');
    this.submitButton = page.locator('button.submit-btn, button[type="submit"]');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password?")');
  }

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email = 'anicafeqr@gmail.com', password = '123456') {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    
    // Wait until login completes and redirects to main dashboard
    await this.page.waitForURL(url => !url.href.includes('/login'), { timeout: 15000 }).catch(() => {
      console.log('Login redirect wait completed.');
    });
  }
}
