import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PostModalComponent } from '../post-modal/post-modal.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Corrected `styleUrl` to `styleUrls`
})
export class HomeComponent implements OnInit {
  forums: any[] = [];
  userData: any = {};
  isDropdownOpen = false;

  constructor(
    private dialog: MatDialog, 
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.getForums();
  }

  getForums() {
    this.authService.getForums().subscribe({
      next: (response) => {
        console.log("forumss", response)
        this.forums = response.posts;
        console.log('Forums retrieved:', this.forums);
      },
      error: (error) => {
        console.error('Error retrieving forums:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  getLoggedInUserId(): number {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    return user.id;
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



  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  isMessagingOpen = true;
  activeChatUser: string | null = null;
  chatMessages: { user: string; message: string }[] = [];

  toggleMessaging() {
    this.isMessagingOpen = !this.isMessagingOpen;
  }

  openChat(user: string) {
    this.activeChatUser = user;
    this.chatMessages = []; // Load previous messages for the user if available
    document.getElementById('chat-with')!.innerText = `Chat with: ${user}`;
  }

  sendMessage() {
    const inputElement = document.querySelector('.chat-input') as HTMLInputElement;
    const message = inputElement.value.trim();

    if (message) {
      this.chatMessages.push({ user: 'You', message });
      inputElement.value = '';
      const chatWindow = document.querySelector('.chat-messages');
      if (chatWindow) {
        chatWindow.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    }
  }

  openPostModal(): void {
    const dialogRef = this.dialog.open(PostModalComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.forums.unshift(result.post);
        this.getForums();
      }
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.isDropdownOpen = false; // Close the dropdown after navigating
  }

  Logout() {
    this.router.navigate(['/login']);
    this.isDropdownOpen = false; // Close the dropdown after navigating
  }

  addNewPost(post: any) {
    this.forums.unshift(post); // Add new post to the beginning of the array
  }
}
