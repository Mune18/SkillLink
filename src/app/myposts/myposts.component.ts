import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { PostModalComponent } from '../post-modal/post-modal.component';
import { Router } from '@angular/router';

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
export class MypostsComponent {
  posts = [
    { id: '1', content: 'Lorem ipsum dolor sit amet...', image: 'assets/post-image.png' },
    { id: '2', content: 'Another sample post content...', image: 'assets/post-image.png' },
  ];

  isDropdownOpen = false;

  // Inject MatDialog into the constructor
  constructor(private dialog: MatDialog, private router: Router) {}
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

  openPostModal(): void {
    const dialogRef = this.dialog.open(PostModalComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Post created:', result);
      }
    });
  }

  editPost(postId: string): void {
    console.log('Edit post with ID:', postId);
  }

  deletePost(postId: string): void {
    console.log('Delete post with ID:', postId);
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
