import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink,TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authservice = inject(AuthService)
  router = inject(Router)
  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      username: new FormControl(""),
      email: new FormControl("", [Validators.required, Validators.email]),
      dateOfBirth: new FormControl("", Validators.required),
      gender: new FormControl("", Validators.required),
      password: new FormControl("", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
      rePassword: new FormControl("", Validators.required)
    },
    {validators:[this.confirmPassword]}
  );
  msgError: string = ""

  loading: boolean = false

  registerSubscribe: Subscription = new Subscription();

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (rePassword !== password && rePassword !== '') {
      group.get('rePassword')?.setErrors({ misMatch: true });
      return { misMatch: true };
    }
    return null;
  }

showPassword(el:HTMLInputElement):void{
  if(el.type==="password"){
    el.type='text'
  }else{
    el.type="password"
  }
}


  submitForm(): void {
    if (this.registerForm.valid) {
      this.loading = true

      this.registerSubscribe.unsubscribe();

      this.registerSubscribe = this.authservice.register(this.registerForm.value).subscribe({

        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);

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
      this.registerForm.markAllAsTouched()
    }
  }
}

