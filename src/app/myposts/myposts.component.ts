import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { PostModalComponent } from '../post-modal/post-modal.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-myposts',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    MatMenuModule,
  ],
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.css'],
})
export class MypostsComponent implements OnInit {
  forums: any[] = [];
  userData: any = {};
  isDropdownOpen = false;

  constructor(
    private dialog: MatDialog, 
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.fetchUserData();
    this.getMyPost();
  }

  checkAuthentication() {
    const token = this.authService.getToken();
    const userId = this.authService.getID();
    
    if (!token || !userId) {
      this.authService.clearLoginData();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  getMyPost() {
    const token = this.authService.getToken();
    const userId = this.authService.getID();
  
    if (!token || !userId) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.authService.getMyForumById(userId).subscribe({
      next: (response) => {
        if (response && response.forums) {
          this.forums = response.forums;
          this.userData = response.user;
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.isDropdownOpen = false;
  }

  Logout() {
    this.authService.clearLoginData();
    this.router.navigate(['/login']);
    this.isDropdownOpen = false;
  }

  openPostModal(): void {
    const dialogRef = this.dialog.open(PostModalComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Refresh the posts list after creating a new post
        this.getMyPost();
      }
    });
  }

  fetchUserData(): void {
    const userId = this.authService.getID();
    if (userId) {
      this.authService.getMyData(userId).subscribe({
        next: (response) => {
          this.userData = response.user;
          console.log('User data fetched successfully:', response);
        },
        error: (error) => {
          console.error('Failed to fetch user data:', error);
          if (error.status === 401) {
            this.authService.clearLoginData();
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      console.error('No user ID found in local storage.');
      this.router.navigate(['/login']);
    }
  }

  isMessagingOpen = true;
  activeChatUser: string | null = null;
  chatMessages: { user: string; message: string }[] = [];

  toggleMessaging() {
    this.isMessagingOpen = !this.isMessagingOpen;
  }

  openChat(user: string) {
    this.activeChatUser = user;
    this.chatMessages = [];
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

  editPost(postId: string): void {
    console.log('Edit post with ID:', postId);
  }

  deletePost(postId: string): void {
    console.log('Delete post with ID:', postId);
  }
}
