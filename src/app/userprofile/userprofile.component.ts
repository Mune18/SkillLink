import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserprofileComponent implements OnInit {
  userData: any = {};
  constructor(private dialog: MatDialog, private router: Router,  private authService: AuthService) {}

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


    isDropdownOpen = false;
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }

    goToProfile() {
      this.router.navigate(['/profile']);
      this.isDropdownOpen = false; // Close the dropdown after navigating
    }

    Logout() {
      this.router.navigate(['/login']);
      this.isDropdownOpen = false; // Close the dropdown after navigating
    }
}
