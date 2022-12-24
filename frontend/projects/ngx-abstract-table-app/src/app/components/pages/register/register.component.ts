import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  public submitForm(): void {
    if (this.registerForm.invalid ||
      !this.registerForm.contains('username') ||
      !this.registerForm.contains('email') ||
      !this.registerForm.contains('password')){
      return;
    }
    let username = this.registerForm.get('username')?.value;
    let email = this.registerForm.get('email')?.value;
    let password = this.registerForm.get('password')?.value;
    this.userService.register(username, email, password)
      .subscribe((user: User | null) => {
        if (user){
          this.userService.signIn(user);
        }
      });
  }

}
