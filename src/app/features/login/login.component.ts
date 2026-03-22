import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink,TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  authservice = inject(AuthService);
  router = inject(Router);
  builder = inject(FormBuilder);


  loginForm: FormGroup = this.builder.nonNullable.group({
    login: ["", [Validators.required, Validators.minLength(3)]],
    password: ["",[Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]]
  })

  msgError: string = ""

  loading: boolean = false

  loginSubscribe: Subscription = new Subscription();


  showPassword(el: HTMLInputElement): void {
    if (el.type === "password") {
      el.type = 'text'
    } else {
      el.type = "password"
    }
  }
  submitForm(): void {
    if (this.loginForm.valid) {
      this.loading = true

      this.loginSubscribe.unsubscribe();

      this.loginSubscribe = this.authservice.login(this.loginForm.value).subscribe({

        next: (res) => {
          console.log(res);

          localStorage.setItem('userToken', res.data.token);
          localStorage.setItem('socialUser', JSON.stringify(res.data.user));

          this.router.navigate(['/feed']);

        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message;
          console.log(err);
          this.loading = false;


        }, complete: () => {
          this.loading = false;
        }
      })



    } else {
      this.loginForm.markAllAsTouched()
    }
  }
}
