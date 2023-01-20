import {ItemResponse} from "./item-response.interface";

export interface RegisterResponse {
  username: string;
  email: string;
  token: string;
  cart: ItemResponse[]
}
