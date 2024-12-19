import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-internregister',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './internregister.component.html',
  styleUrls: ['./internregister.component.css']
})
export class InternregisterComponent implements OnInit {
  signupForm: FormGroup;
  backendErrors: { [key: string]: string[] } | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', Validators.required],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      school: ['', Validators.required],
      degree: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : {'mismatch': true};
  }

  register(): void {
    if (this.signupForm.valid) {
      this.authService.registerIntern(this.signupForm.value).subscribe({
        next: (response) => {
          this.authService.setLoginData(response.token, response.role);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          if (error.errors) {
            this.backendErrors = error.errors;
            Object.keys(error.errors).forEach(key => {
              const control = this.signupForm.get(key);
              if (control) {
                control.setErrors({ serverError: error.errors[key][0] });
              }
            });
          } else {
            console.error('Registration failed:', error);
          }
        }
      });
    }
  }
}
