import {Component, Injector, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../app/services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {AUTHENTICATION_SERVICE_TOKEN} from '../../app/injection-tokens/injection-token';
import {authenticationFactory} from '../../app/interfaces/authentication.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    {
      provide: AUTHENTICATION_SERVICE_TOKEN,
      useFactory: authenticationFactory,
      deps: [Injector]
    }
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    if (this.authenticationService.isAuthenticatedSync()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.authenticationService.setCurrentUser(response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = error?.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
