import { APIRequestContext, expect, Page } from "@playwright/test";
import { BILL_PAY_AMOUNT, DEFAULT_TIMEOUT } from "../configs/constants";
import { UserData } from "../test-data/user-data";

export class ParaBankPage {
  constructor(private page: Page) {}

  async navigateToHome() {
    await this.page.goto("https://parabank.parasoft.com/");
    await expect(this.page).toHaveTitle(/ParaBank/);
  }

  async registerNewUser(userData: UserData) {
    await this.page.getByText("Register").click();
    await this.page.fill(
      'input[name="customer.firstName"]',
      userData.firstName,
    );
    await this.page.fill('input[name="customer.lastName"]', userData.lastName);
    await this.page.fill(
      'input[name="customer.address.street"]',
      userData.address.street,
    );
    await this.page.fill(
      'input[name="customer.address.city"]',
      userData.address.city,
    );
    await this.page.fill(
      'input[name="customer.address.state"]',
      userData.address.state,
    );
    await this.page.fill(
      'input[name="customer.address.zipCode"]',
      userData.address.zipCode,
    );
    await this.page.fill(
      'input[name="customer.phoneNumber"]',
      userData.phoneNumber,
    );
    await this.page.fill('input[name="customer.ssn"]', userData.ssn);
    await this.page.fill('input[name="customer.username"]', userData.username);
    await this.page.fill('input[name="customer.password"]', userData.password);
    await this.page.fill('input[name="repeatedPassword"]', userData.password);
    await this.page.getByRole("button", { name: "Register" }).click();
    await expect(
      this.page.getByText("Your account was created successfully"),
    ).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.getByRole("button", { name: "Log In" }).click();
    await expect(
      this.page.getByRole("heading", { name: "Accounts Overview" }),
    ).toBeVisible();
  }

  async logout() {
    await this.page.getByRole("link", { name: "Log Out" }).click();
  }

  async createSavingsAccount() {
    await this.page.getByRole("link", { name: "Open New Account" }).click();
    const accountType = "select#type";
    // Get all account type options and print their count
    const allAccountTypeOptions = await this.page.$$(accountType + " > option");

    for (const option of allAccountTypeOptions) {
      const text = await this.page.evaluate(
        (option) => option.textContent,
        option,
      );

      if (text == "SAVINGS") {
        await this.page.selectOption(accountType, { label: text });
        break;
      }
    }

    await this.page.waitForTimeout(DEFAULT_TIMEOUT); // Waits for 2 seconds (use sparingly)
    await this.page.getByRole("button", { name: "Open New Account" }).click();
    // Wait for the "Account Opened!" heading to be visible
    await expect(
      this.page.getByRole("heading", { name: "Account Opened!" }),
    ).toBeVisible();
    // Find the account number from the confirmation link
    const accountLink = this.page.locator("#newAccountId");
    await expect(accountLink).toBeVisible();
    const accountNumber = await accountLink.textContent();
    console.log(accountNumber);
    if (!accountNumber || !/\d+/.test(accountNumber)) {
      throw new Error("Account number not found after account creation.");
    }
    expect(accountNumber).toMatch(/\d+/);
    return accountNumber;
  }

  async verifyAccountCreated(accountNumber: string) {
    await this.page.getByRole("link", { name: "Accounts Overview" }).click();
    await expect(this.page.getByText(accountNumber)).toBeVisible();
    const balance = await this.page
      .locator(`tr:has-text("${accountNumber}") td`)
      .nth(2)
      .textContent();
    expect(Number(balance.replace(/[^\d.]/g, ""))).toBeGreaterThanOrEqual(0);
  }

  async transferFunds({
    amount,
    fromAccount,
    toAccount,
  }: {
    amount: string;
    fromAccount: string;
    toAccount: string;
  }) {
    await this.page.getByRole("link", { name: "Transfer Funds" }).click();
    await this.page.fill('input[id="amount"]', amount);
    await this.page.selectOption("select#fromAccountId", fromAccount);
    await this.page.selectOption("select#toAccountId", fromAccount);
    await this.page.getByRole("button", { name: "Transfer" }).click();
    await expect(this.page.getByText("Transfer Complete!")).toBeVisible();
  }

  async payBill({
    payee,
    amount,
    fromAccount,
  }: {
    payee: {
      name: string;
      address: { street: string; city: string; state: string; zipCode: string };
      phoneNumber: string;
      accountNumber: string;
      verifyAccount: string;
    };
    amount: string;
    fromAccount: string;
  }) {
    await this.page.getByRole("link", { name: "Bill Pay" }).click();
    await this.page.fill('input[name="payee.name"]', "Demo Payee");
    await this.page.fill('input[name="payee.address.street"]', "456 Payee St");
    await this.page.fill('input[name="payee.address.city"]', "Payee City");
    await this.page.fill('input[name="payee.address.state"]', "PY");
    await this.page.fill('input[name="payee.address.zipCode"]', "67890");
    await this.page.fill('input[name="payee.phoneNumber"]', "9876543210");
    await this.page.fill('input[name="payee.accountNumber"]', fromAccount);
    await this.page.fill('input[name="verifyAccount"]', fromAccount);
    await this.page.fill('input[name="amount"]', amount);
    await this.page.selectOption('select[name="fromAccountId"]', fromAccount);
    await this.page.getByRole("button", { name: "Send Payment" }).click();
    await this.page.waitForTimeout(DEFAULT_TIMEOUT); // Wait for 2 seconds to ensure the payment is processed
    await this.page.getByRole("button", { name: "Send Payment" }).click();
    await expect(this.page.getByText("Bill Payment Complete")).toBeVisible();
    console.log(
      "Bill payment for amount " + BILL_PAY_AMOUNT + " was successful",
    );
  }
}
