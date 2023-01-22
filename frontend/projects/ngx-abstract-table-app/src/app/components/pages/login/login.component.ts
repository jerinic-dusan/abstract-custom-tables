import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user.model";

/**
 * Login page handles all login logic and redirects the user to home page in case of the successful login attempt
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  public submitForm(): void {
    if (this.loginForm.invalid ||
        !this.loginForm.contains('username') ||
        !this.loginForm.contains('password')){
      return;
    }
    let username = this.loginForm.get('username')?.value;
    let password = this.loginForm.get('password')?.value;
    this.userService.login(username, password)
      .subscribe((user: User | null) => {
        if (user){
          this.userService.signIn(user);
        }
    });
  }

}
