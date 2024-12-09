import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  posts = [
    { content: 'Lorem ipsum dolor sit amet...', image: 'assets/post-image.png' },
    { content: 'Another sample post content...', image: 'assets/post-image.png' },
  ];

  isDropdownOpen = false;

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

}
