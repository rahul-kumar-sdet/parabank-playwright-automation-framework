import { APIRequestContext, expect } from "@playwright/test";
import { BASE_URL, API_LOGIN_URL } from "../configs/constants";

export class ParaBankApi {
  constructor(private request: APIRequestContext) {}

  async login(username: string, password: string) {
    const response = await this.request.post(API_LOGIN_URL, {
      form: { username, password },
    });
    expect(response.ok()).toBeTruthy();
    return response;
  }

  async getTransactions(
    accountNumber: string,
    amount: string,
    username?: string,
    password?: string,
  ) {
    const headers: Record<string, string> = {};
    if (username && password) {
      const encoded = Buffer.from(`${username}:${password}`).toString("base64");
      headers["Authorization"] = `Basic ${encoded}`;
    }
    const response = await this.request.get(
      `${BASE_URL}/parabank/services_proxy/bank/accounts/${accountNumber}/transactions/amount/${amount}?timeout=30000`,
      { headers },
    );
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }
}
