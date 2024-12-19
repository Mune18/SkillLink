import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-employerregister',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  FormsModule],
  templateUrl: './employerregister.component.html',
  styleUrls: ['./employerregister.component.css']
})
export class EmployerregisterComponent implements OnInit {
  signupForm: FormGroup;
  backendErrors: { [key: string]: string[] } | null = null;
  errorMessage: string | null = null;
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
      company: ['', Validators.required],
      industry: ['', Validators.required],
      position: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
  }

   get email() {
    return this.signupForm.get('email');
  }

    get password() {
    return this.signupForm.get('password');
  }

  get passwordConfirmation() {
    return this.signupForm.get('password_confirmation');
  }



  // Custom validator to check if passwords match
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : {'mismatch': true};
  }

register(): void {
    if (this.signupForm.valid) {
      this.authService.registerRecruiter(this.signupForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.authService.setLoginData(response.token, response.role, response.id);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          if (error.status === 422 && error.error.errors?.email) {
            this.errorMessage = error.error.errors.email[0]; // Extract email error
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        }
      });
    }
  }
}
