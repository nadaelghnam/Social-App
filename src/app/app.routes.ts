import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';



export const routes: Routes = [
  {path:"" , redirectTo:"login", pathMatch:"full" , title:"Login Page"},
  {
    path: '', loadComponent: () => import("./layouts/auth-layout/auth-layout.component").then((c) => c.AuthLayoutComponent),
    canActivate:[guestGuard],
    children: [
      { path: 'login', loadComponent: () => import("./features/login/login.component").then((c) => c.LoginComponent), title:"Login Page" },
      { path: 'register', loadComponent: () => import("./features/register/register.component").then((c) => c.RegisterComponent) , title:"Register Page"},
      { path: 'forgotpassword', loadComponent: () => import("./features/forgot-password/forgot-password.component").then((c) => c.ForgotPasswordComponent) , title:"ForgotPassword Page"},
    ]
  },
  {
    path: '',
     loadComponent: () => import("./layouts/main-layout/main-layout.component").then((c) => c.MainLayoutComponent),
     canActivate:[authGuard],
    children: [
      { path: 'feed', loadComponent: () => import("./features/feed/feed.component").then((c) => c.FeedComponent), title:"TimeLine Page" },
      { path: 'profile', loadComponent: () => import("./features/profile/profile.component").then((c) => c.ProfileComponent), title:"Profile Page" },
      { path: 'notification', loadComponent: () => import("./features/notification/notification.component").then((c) => c.NotificationComponent), title:"FNotification Page" },
      { path: 'changepassword', loadComponent: () => import("./features/change-password/change-password.component").then((c) => c.ChangePasswordComponent), title:"ChangePassword Page" },
      { path: 'details/:id', loadComponent: () => import("./features/details/details.component").then((c) => c.DetailsComponent), title:"Post Details" },
    ]
  },
  {path:'**' , component:NotfoundComponent ,title:"Notfound Page"}
];
