import { Routes } from '@angular/router';
import { MemeFeedComponent } from './components/meme-feed/meme-feed.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { TrendingComponent } from './components/trending/trending.component';
import { SavedMemesComponent } from './components/saved-memes/saved-memes.component';
import { RegisterComponent } from './components/register/register.component';
import { MemersComponent } from './components/memers/memers.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        children: [
            { 
                path: '', 
                component: MemeFeedComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
            {
                path: 'trending',
                component: TrendingComponent
            },
            {
                path: 'saved',
                component: SavedMemesComponent
            },
            {
                path: 'memers',
                component: MemersComponent
            },
            {
                path: 'change-password',
                component: PasswordResetComponent
            },
            { 
                path: 'login', 
                component: LoginComponent,
                canActivate: [AuthGuard]
            }
        ]
    },
    { 
        path: '**', 
        redirectTo: '' 
    }
];