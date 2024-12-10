import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

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
  ],
})
export class PostModalComponent {
  postTo: string = ''; // To store the value selected in mat-select
  postContent: string = ''; // To store the content entered in textarea

  constructor(private dialogRef: MatDialogRef<PostModalComponent>) {}

  close(): void {
    this.dialogRef.close(); // Close the modal
  }

  save(): void {
    const postData = {
      title: 'Sample Title', // Replace with form values
      content: this.postContent,
      postTo: this.postTo,
    };
    this.dialogRef.close(postData); // Return the data
  }

  // Implement the methods referenced in the template
  closeDialog(): void {
    this.dialogRef.close(); // Close the modal
  }

  submitPost(): void {
    const postData = {
      title: 'Sample Title', // Add title logic if needed
      content: this.postContent,
      postTo: this.postTo,
    };
    this.dialogRef.close(postData); // Post the data
  }
}
