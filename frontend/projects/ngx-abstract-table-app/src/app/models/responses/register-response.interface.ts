import {ItemResponse} from "./item-response.interface";

/**
 * Interface specifies the register response object
 * @username - Specifies the username of the registered user
 * @email - Specifies the email of the registered user
 * @token - Specifies the token of the registered user
 * @cart - Specifies the cart items of the registered user
 */
export interface RegisterResponse {
  username: string;
  email: string;
  token: string;
  cart: ItemResponse[]
}
