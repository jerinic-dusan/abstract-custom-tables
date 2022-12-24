import {Item} from "./item.model";
import {Injectable} from "@angular/core";
import {Mapper} from "./mapper.interface";
import {LoginResponse} from "./responses/login-response.interface";
import {RegisterResponse} from "./responses/register-response.interface";

export class User {
  private _username: string;
  private _email: string;
  private _token: string;
  private _cartItems: Item[];

  constructor(username: string, email: string, token: string, cartItems: Item[] = []) {
    this._username = username;
    this._email = email;
    this._token = token;
    this._cartItems = cartItems;
  }

  public get username(): string {
    return this._username;
  }

  public set username(value: string) {
    this._username = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get token(): string {
    return this._token;
  }

  public set token(value: string) {
    this._token = value;
  }

  public get cartItems(): Item[] {
    return this._cartItems;
  }

  public set cartItems(value: Item[]) {
    this._cartItems = value;
  }
}

@Injectable({providedIn: "root"})
export class UserMapper implements Mapper<User> {
  public map(item: LoginResponse | RegisterResponse): User {
    return new User(
      item.username,
      item.email,
      item.token
    );
  }
}
