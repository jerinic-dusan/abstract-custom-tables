import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {Observable, of} from "rxjs";

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
