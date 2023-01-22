import {ItemResponse} from "./item-response.interface";

/**
 * Interface specifies the login response object
 * @username - Specifies the username of the logged user
 * @email - Specifies the email of the logged user
 * @token - Specifies the token of the logged user
 * @cart - Specifies the cart items of the logged user
 */
export interface LoginResponse {
  username: string;
  email: string;
  token: string;
  cart: ItemResponse[]
}
