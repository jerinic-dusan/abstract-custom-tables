import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";

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
