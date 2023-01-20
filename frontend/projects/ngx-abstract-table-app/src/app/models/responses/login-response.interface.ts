import {ItemResponse} from "./item-response.interface";

export interface LoginResponse {
  username: string;
  email: string;
  token: string;
  cart: ItemResponse[]
}
