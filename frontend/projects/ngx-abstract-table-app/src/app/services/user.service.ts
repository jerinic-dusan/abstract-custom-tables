import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User, UserMapper} from "../models/user.model";
import {catchError, map} from "rxjs/operators";
import {ApiResponse} from "../models/responses/api-response.interface";
import {UtilsService} from "./utils.service";
import {LoginResponse} from "../models/responses/login-response.interface";
import {RegisterResponse} from "../models/responses/register-response.interface";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = 'http://localhost:8080/users/';
  private loggedUser: User | null = null;

  constructor(private http: HttpClient,
              private router: Router,
              private utilsService: UtilsService,
              private userMapper: UserMapper) { }

  public login(username: string, password: string): Observable<User | null> {
    return this.http.post<ApiResponse<LoginResponse>>(this.url.concat('login'), {
      username: username,
      password: password
    }).pipe(
      map(((response: ApiResponse<LoginResponse>) => this.userMapper.map(<LoginResponse>response.data))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, null))
    );
  }

  public register(username: string, email: string, password: string): Observable<User | null> {
    return this.http.post<ApiResponse<RegisterResponse>>(this.url.concat('register'), {
      username: username,
      email: email,
      password: password
    }).pipe(
      map(((response: ApiResponse<RegisterResponse>) => this.userMapper.map(<RegisterResponse>response.data))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, null))
    );
  }

  /**
   * For lack of better word, this name will suffice :0
   * @param user
   */
  public signIn(user: User): void {
    this.loggedUser = user;
    localStorage.setItem('token', user.token);
    this.router.navigate(['/home']).then(() => {});
  }

  public signOut(): void {
    this.loggedUser = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {});
  }
}
