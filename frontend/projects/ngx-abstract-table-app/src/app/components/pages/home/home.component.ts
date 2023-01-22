import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {Observable, of} from "rxjs";

/**
 * Home page component displaying both all items and cart items components.
 * This component also handles the reload page event.
 * As this is a single page web-app and if reload is omitted, backend needs to resend us needed user information.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public loggedUser: Observable<User | null> = of(null);

  constructor(private userService: UserService) {
    this.loggedUser = userService.user$;
    userService.checkLoggedUser();
  }

  public signOut(): void {
    this.userService.signOut();
  }

  ngOnInit(): void {
  }

}
