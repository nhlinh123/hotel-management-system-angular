import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthenticationService} from '../../app/services/authentication.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {AUTHENTICATION_SERVICE_TOKEN} from '../../app/injection-tokens/injection-token';
import {authenticationFactory} from '../../app/interfaces/authentication.interface';
import {catchError, Observable, of, pipe, Subscription, tap} from 'rxjs';
import {AuthenticationResponse} from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

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
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public submitted = false;
  public loading = false;
  public error = '';

  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    if (this.authenticationService.isAuthenticatedSync()) {
      this.router.navigate([NAVIGATION_ROUTES.DASHBOARD]);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
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
    this.subscription = this.authenticationService.login(this.loginForm.value)
      .pipe(
        tap((response: AuthenticationResponse) => {
          this.authenticationService.setCurrentUser(response);
          this.router.navigate([NAVIGATION_ROUTES.DASHBOARD]);
        }),
        catchError((err: any) => {
          this.error = err?.error?.message || 'Login failed. Please try again.';
          this.loading = false;
          return of(false);
        })
      ).subscribe();
  }
}
