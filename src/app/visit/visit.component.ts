import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-visit',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.css'
})
export class VisitComponent {
  userData: any = {};
  stateData: any = {};
  userRoleData:any = {};
  displayedForums: any[] = [];
  forums: any[] = [];
  showAll: boolean = false;
  constructor(private dialog: MatDialog, private router: Router,  private authService: AuthService) {}

  ngOnInit(): void {
    this.stateData = history.state;
    // const userId = this.getLoggedInUserId();
    this.fetchUserData();
    this.getMyPost();
  }

  fetchUserData(): void {
    const userId = this.stateData.userId;
    if (userId) {
      this.authService.getMyData(+userId).subscribe({
        next: (response) => {
          this.userData = response.user;
          this.userRoleData = response.intern_profile? response.intern_profile : response.recruiter_profile;
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


  getMyPost() {
    const token = this.authService.getToken();
    const userId = this.stateData.userId;

    if (!token || !userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getMyForumById(userId).subscribe({
      next: (response) => {
        if (response && response.forums) {
          this.forums = response.forums;
          this.userData = response.user;
          this.displayedForums = this.forums.slice(0, 3);
          console.log('My forums:', this.forums);
        } else {
          console.log('Invalid response structure:', response);
          this.forums = [];
        }
      },
      error: (error) => {
        console.error('Error retrieving forums:', error);
        if (error.status === 401) {
          this.authService.clearLoginData();
          this.router.navigate(['/login']);
        }
        this.forums = [];
      }
    });
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
    if (this.showAll) {
      this.displayedForums = this.forums;  // Show all posts
    } else {
      this.displayedForums = this.forums.slice(0, 3);  // Show only the first 3 posts
    }
  }

  commentPost(postId: number, forum: any, userData:any): void {
    this.router.navigate(['/comments'], { state: { forum, postId, userData } });
    console.log("DAATAA", userData);
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
