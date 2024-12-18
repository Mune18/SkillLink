import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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
export class UserprofileComponent {

  constructor(private dialog: MatDialog, private router: Router) {}
  
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
