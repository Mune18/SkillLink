import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class PostModalComponent implements OnInit {
  userData: any = {};
  postForm: FormGroup;
  selectedFile: File | null = null; // For storing the selected image file

  constructor(
    private dialogRef: MatDialogRef<PostModalComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(15)]], // At least 5 characters for the title
      desc: ['', [Validators.required, Validators.minLength(30)]], // At least 10 characters for the description
    });
  }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    const userId = this.authService.getID();
    if (userId) {
      this.authService.getMyData(+userId).subscribe({
        next: (response) => {
          this.userData = response.user;
          console.log('User data fetched successfully:', response);
        },
        error: (error) => {
          console.error('Failed to fetch user data:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      console.error('No user ID found in local storage.');
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  submitPost(): void {
    if (this.postForm.valid) {
      const formData = new FormData();
      formData.append('title', this.postForm.get('title')?.value);
      formData.append('desc', this.postForm.get('desc')?.value);
      formData.append('user_id', this.userData.id);
      formData.append('created_at', new Date().toISOString());
      formData.append('likes_count', '0');
      formData.append('comments_count', '0');

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.authService.createForum(formData).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error creating post:', error);
        },
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
