import { test, expect } from "@playwright/test";
import { ParaBankPage } from "../page-objects/ParaBankPage";
import { ParaBankApi } from "../helpers/api-client";
import { TEST_USER } from "../test-data/user-data";
import { BILL_PAY_AMOUNT } from "../configs/constants";

let accountNumber: string;
let paraBankPage: ParaBankPage;

test("Complete user journey", async ({ page }) => {
  // Registration and Login
  paraBankPage = new ParaBankPage(page);
  await paraBankPage.navigateToHome();
  await paraBankPage.registerNewUser(TEST_USER);
  await paraBankPage.logout();
  await paraBankPage.login(TEST_USER.username, TEST_USER.password);

  // Create Account
  accountNumber = await paraBankPage.createSavingsAccount();
  await paraBankPage.verifyAccountCreated(accountNumber);

  // Perform Transactions
  await paraBankPage.transferFunds({
    amount: "10",
    fromAccount: accountNumber,
    toAccount: accountNumber,
  });

  await paraBankPage.payBill({
    amount: String(BILL_PAY_AMOUNT),
    fromAccount: accountNumber,
    payee: {
      name: "Demo Payee",
      accountNumber: accountNumber,
      verifyAccount: accountNumber, // Same account for verification
      address: {
        street: "456 Payee St",
        city: "Payee City",
        state: "PY",
        zipCode: "67890",
      },
      phoneNumber: "9876543210",
    },
  });

  await paraBankPage.logout();
});

test("API Transaction Verification", async ({ request }) => {
  const api = new ParaBankApi(request);
  console.log("The Account number is " + accountNumber);

  const transactions = await api.getTransactions(
    accountNumber,
    String(BILL_PAY_AMOUNT),
    TEST_USER.username,
    TEST_USER.password,
  );

  // Validate transactions
  expect(Array.isArray(transactions)).toBeTruthy();
  for (const transaction of transactions) {
    await validateTransaction(transaction, BILL_PAY_AMOUNT);
  }
});

function validateTransaction(transaction: any, expectedAmount: number) {
  const requiredProps = ["id", "accountId", "type", "amount", "date"];
  requiredProps.forEach((prop) => expect(transaction).toHaveProperty(prop));

  expect(typeof transaction.id).toBe("number");
  expect(typeof transaction.accountId).toBe("number");
  expect(typeof transaction.type).toBe("string");
  expect(typeof transaction.date).toBe("number");
  expect(parseFloat(transaction.amount)).toBe(
    parseFloat(String(expectedAmount)),
  );
}
