import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MypostsComponent } from './myposts/myposts.component';
import { InternregisterComponent } from './internregister/internregister.component';
import { EmployerregisterComponent } from './employerregister/employerregister.component';
import { ProfileComponent } from './profile/profile.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { CommentComponent } from './comment/comment.component';
import { VisitComponent } from './visit/visit.component';

export const routes: Routes = [
  { path: 'login', title: 'SkillLink', component: LoginComponent },
  { path: 'home', title: 'Home | SkillLink', component: HomeComponent },
  { path: 'posts', title: 'My Posts | SkillLink', component: MypostsComponent },
  { path: 'intern', title: 'Intern | SkillLink', component: InternregisterComponent },
  { path: 'employer', title: 'Recruiter | SkillLink', component: EmployerregisterComponent },
  { path: 'profile', title: 'Profile | SkillLink', component: ProfileComponent },
  { path: 'userprofile', title: 'User Profile | SkillLink', component: UserprofileComponent },
  {path: 'comments', title: 'Home | SkillLink', component: CommentComponent},
  {path: 'visit', title: 'Profile | SkillLink', component: VisitComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

