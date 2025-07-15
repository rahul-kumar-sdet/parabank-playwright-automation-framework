import { PASSWORD, RANDOM_USERNAME } from "../configs/constants";

export interface UserData {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

export const TEST_USER: UserData = {
  firstName: "Test",
  lastName: "User",
  address: {
    street: "123 Main St",
    city: "Testville",
    state: "TS",
    zipCode: "12345",
  },
  phoneNumber: "1234567890",
  ssn: "123-45-6789",
  username: RANDOM_USERNAME,
  password: PASSWORD,
};
