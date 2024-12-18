import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MypostsComponent } from './myposts/myposts.component';
import { InternregisterComponent } from './internregister/internregister.component';
import { EmployerregisterComponent } from './employerregister/employerregister.component';
import { ProfileComponent } from './profile/profile.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'posts', component: MypostsComponent },
    { path: 'intern', component: InternregisterComponent },
    { path: 'employer', component: EmployerregisterComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'userprofile', component: UserprofileComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
