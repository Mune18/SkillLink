import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';



export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('password_confirmation')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

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

  get email() {
    return this.signupForm.get('email');
  }

    get password() {
    return this.signupForm.get('password');
  }

  get passwordConfirmation() {
    return this.signupForm.get('password_confirmation');
  }


  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : {'mismatch': true};
  }

  register(): void {
    if (this.signupForm.valid) {
      this.authService.registerIntern(this.signupForm.value).subscribe({
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



  // register(): void {
  //   if (this.signupForm.valid) {
  //     this.authService.registerIntern(this.signupForm.value).subscribe({
  //       next: (response) => {
  //         console.log('Registration successful:', response);
  //         this.signupForm.reset();
  //         this.backendErrors = null;
  //       },
  //       error: (error) => {
  //         console.error('Registration failed:', error);
  //         if (error.status === 422) {
  //           this.backendErrors = error.error.errors;
  //         }
  //       }
  //     });
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }
}
