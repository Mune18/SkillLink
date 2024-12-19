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
    FormsModule, // Import FormsModule for ngModel
    ReactiveFormsModule
  ],
})
export class PostModalComponent implements OnInit {
  userData: any = {};
  postForm: FormGroup;

  postTo: string = ''; // To store the value selected in mat-select
  desc: string = ''; // To store the content entered in textarea

  constructor(private dialogRef: MatDialogRef<PostModalComponent>,  private fb: FormBuilder,private authService: AuthService,private router: Router) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      image: [''],
    });
  }


  ngOnInit(): void {
    // const userId = this.getLoggedInUserId();
    this.fetchUserData();
  }

  fetchUserData(): void {
    const userId = this.authService.getID();
    if (userId) {
      this.authService.getMyData(+userId).subscribe({
        next: (response) => {
          this.userData = response.user;
          console.log('User data fetched successfully:', response);
          console.log("my data:", this.userData)
          // this.userProfileImage = `${this.authService.apiUrl}${this.userData.profile_image}`;
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


  submitPost(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      this.authService.createForum(postData).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          // Optionally, you can add logic to handle the response, like showing a success message
        },
        error: (error) => {
          console.error('Error creating post:', error);
          // Optionally, handle the error, e.g., show an error message to the user
        }
      });
      console.log('Post submitted:', postData);
      this.closeDialog();
    }
  }

  close(): void {
    this.dialogRef.close(); // Close the modal
  }



  // Implement the methods referenced in the template
  closeDialog(): void {
    this.dialogRef.close(); // Close the modal
  }


}
