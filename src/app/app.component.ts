import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MypostsComponent } from './myposts/myposts.component';
import { EmployerregisterComponent } from './employerregister/employerregister.component';
import { InternregisterComponent } from './internregister/internregister.component';
import { ProfileComponent } from './profile/profile.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    HomeComponent,
    MypostsComponent,
    EmployerregisterComponent,
    InternregisterComponent,
    ProfileComponent,
    UserprofileComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'skilllink1';
}
