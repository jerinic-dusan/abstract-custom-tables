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

/**
 * User service encapsulates all user related http requests to the back-end.
 * It also holds the information for current logged user as well as handling the post log in and log out cleanup.
 */
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

  /**
   * Method creates a http post request to attempt to log in the user and returns a mapped observable.
   * If error is omitted, it's handled and a null value is returned in an observable.
   */
  public login(username: string, password: string): Observable<User | null> {
    return this.http.post<ApiResponse<LoginResponse>>(this.url.concat('login'), {
      username: username,
      password: password
    }).pipe(
      map(((response: ApiResponse<LoginResponse>) => this.userMapper.map(<LoginResponse>response.data))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, null))
    );
  }

  /**
   * Method creates a http post request to attempt to register the user and returns a mapped observable.
   * If error is omitted, it's handled and a null value is returned in an observable.
   */
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
   * Method creates a http get request to fetch user information and returns a mapped observable.
   * If error is omitted, it's handled and a null value is returned in an observable.
   */
  private reload(): Observable<User | null> {
    return this.http.get<ApiResponse<LoginResponse>>(this.url.concat('reload'), {
      headers: this.utilsService.initHeaders()
    }).pipe(
        map(((response: ApiResponse<RegisterResponse>) => this.userMapper.map(<RegisterResponse>response.data))),
        catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, null))
    );
  }

  /**
   * Method sets the current logged user, sets the token in local storage and navigates the user to home page.
   * @param user - Specifies the current logged user
   */
  public signIn(user: User): void {
    this.user.next(user);
    localStorage.setItem('token', user.token);
    this.router.navigate(['/home']).then(() => {});
  }

  /**
   * Method unsets the current logged user, unsets the token in local storage and navigates the user to login page.
   */
  public signOut(): void {
    this.user.next(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {});
  }

  /**
   * Method checks whether the reload event occurred and the logged user needs to be reset
   */
  public checkLoggedUser(): void {
    if (!this.loggedUser){
      this.reload().subscribe(value => this.user.next(value));
    }
  }
}
