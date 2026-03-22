import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  authService = inject(AuthService);
  toastr = inject(ToastrService);

  isLoading: boolean = false;


  isCurrentPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  passwordForm = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.passwordPattern)
    ]),
    rePassword: new FormControl(null, [Validators.required])
  });

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.toastr.warning('Please ensure your new password meets the security requirements.', 'social');
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (this.passwordForm.value.newPassword !== this.passwordForm.value.rePassword) {
      this.toastr.error('New passwords do not match!', 'social');
      return;
    }

    this.isLoading = true;

    const model = {
      password: this.passwordForm.value.password,
      newPassword: this.passwordForm.value.newPassword
    };

    this.authService.changePassword(model).subscribe({
      next: (res) => {
        this.isLoading = false;

        this.toastr.success('Password changed successfully!', 'social');

        setTimeout(() => {
          this.authService.logOut();
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Change Password API Error:", err);
      }
    });
  }
}
