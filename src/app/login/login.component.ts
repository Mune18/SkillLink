import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule , RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  backendErrors: { [key: string]: string[] } | null = null;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,) {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
    );
  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


  login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          const role:string = response.user.role;
          const token = response.access_token;
          const id = response.user.id;
          console.log('Login successful:', response);
          this.loginForm.reset();
          this.backendErrors = null;
          this.authService.setLoginData(token, role, id);
          console.log("TOKEENNN",this.authService.getToken());
          this.router.navigate(['/home']);

        },
        error: (error) => {
          console.error('Login failed:', error);
          if (error.status === 422) {
            this.backendErrors = error.error.general[0].error; // Validation errors
          } else if (error.error && error.error.error) {
            // Handle general errors like "Invalid credentials"
            this.backendErrors = { general: [error.error.error] };
          }
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
