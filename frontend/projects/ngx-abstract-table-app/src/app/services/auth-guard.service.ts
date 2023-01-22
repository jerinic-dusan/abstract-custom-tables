import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

/**
 * Authentication guard which checks whether the logged users token is expired and if the home page can be visited
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router,
              private jwtHelper: JwtHelperService) { }

  public canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (this.jwtHelper.isTokenExpired(token)) {
      this.router.navigate(['/login']).then(() => {});
      return false;
    }
    return true;
  }
}
