import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PostModalComponent } from '../post-modal/post-modal.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TimeAgoPipe } from './time-ago.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    TimeAgoPipe,
    MatTooltipModule,
   RouterModule,
   MatMenuModule,
   MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Corrected `styleUrl` to `styleUrls`
})
export class HomeComponent implements OnInit {
  forums: any[] = [];
  recentForums: any[] = [];
  topForums: any[] = [];
  userData: any = {};
  userRoleData: any = {};
  isDropdownOpen = false;
  isLoading = true;
  selectedFile: File | null = null; // For storing the selected image file
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.fetchUserData();
    this.getForums();
  }

  // getForums() {
  //   this.authService.getForums().subscribe({
  //     next: (response) => {
  //       console.log("forumss", response)
  //       this.forums = response.posts;
  //       console.log('Forums retrieved:', this.forums);
  //     },
  //     error: (error) => {
  //       console.error('Error retrieving forums:', error);
  //       if (error.status === 401) {
  //         this.router.navigate(['/login']);
  //       }
  //     }
  //   });
  // }


  triggerFileAndModal(): void {
    const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
    if (fileInput) {
      fileInput.click(); // Open file input dialog
    }
    this.openPostModal(); // Open the post modal
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile.name);
    }
  }

  getForums() {
    this.authService.getForums().subscribe({
      next: (response) => {
        // if (response.posts.length === 0) {
        //   this.isLoading = false;
        // }
        this.isLoading = false;
        const userId = this.getLoggedInUserId();
        this.recentForums = response.posts.slice(0, 2);
        this.topForums = response.top_posts;
        this.forums = response.posts.map((forum: any) => ({
          ...forum,
          isLiked: forum.likes.some((like: any) => like.user_id === userId), // Check if the user has already liked the post
        }));
        console.log("Top post", this.topForums)
        console.log('Forums retrieved:', this.forums);
      },
      error: (error) => {
        console.error('Error retrieving forums:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      },
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
          this.userRoleData = response.intern_profile? response.intern_profile : response.recruiter_profile;
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

  likePost(forumId: number, forum: any): void {
    if (forum.isLiked) {
      console.warn('Post is already liked.');
      return;
    }

    const data = { forum_id: forumId, user_id: this.authService.getID() };

    // Optimistic update
    const previousLikesCount = forum.likes_count;
    forum.likes_count++;
    forum.isLiked = true;

    this.authService.likePost(data).subscribe({
      next: (response: any) => {
        console.log('Like successful:', response);
      },
      error: (error: any) => {
        console.error('Error liking the post:', error);
        // Rollback changes if the API call fails
        forum.likes_count = previousLikesCount;
        forum.isLiked = false;

        if (error.status === 403) {
          console.warn('You have already liked this post.');
        }
      },
    });
  }

  commentPost(postId: number, forum: any): void {
    this.router.navigate(['/comments'], { state: { forum, postId } });
  }


  goToProfile() {
    this.router.navigate(['/profile']);
    this.isDropdownOpen = false; // Close the dropdown after navigating
  }

  Visit(userId: number) {
    this.router.navigate([`/visit`], { state: { userId } });
  }

  Logout() {
    this.router.navigate(['/login']);
    this.authService.clearLoginData();
    this.isDropdownOpen = false; // Close the dropdown after navigating
  }

  addNewPost(post: any) {
    this.forums.unshift(post); // Add new post to the beginning of the array
  }
}
