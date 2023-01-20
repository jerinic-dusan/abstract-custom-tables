import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
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
  public loggedUser: User | null = null;

  private user = new BehaviorSubject<User | null>(null);
  public user$ = this.user.asObservable();

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

  private reload(): Observable<User | null> {
    return this.http.get<ApiResponse<LoginResponse>>(this.url.concat('reload'), {
      headers: this.utilsService.initHeaders()
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
    this.user.next(user);
    localStorage.setItem('token', user.token);
    this.router.navigate(['/home']).then(() => {});
  }

  public signOut(): void {
    this.user.next(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {});
  }

  public checkLoggedUser(): void {
    if (!this.loggedUser){
      this.reload().subscribe(value => this.user.next(value));
    }
  }
}
