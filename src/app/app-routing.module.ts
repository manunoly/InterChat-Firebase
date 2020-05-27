import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RolesGuard } from './_guards/roles.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'chat-list',
    loadChildren: () => import('./chat-list/chat-list.module').then(m => m.ChatListPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat-list/chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'select-user-to-chat',
    loadChildren: () => import('./select-user-to-chat/select-user-to-chat.module').then(m => m.SelectUserToChatPageModule),
    canActivate: [RolesGuard], 
    data: { 
      expectedRole: 'user'
    } 
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'call-center-chat-list',
    loadChildren: () => import('./call-center-chat-list/call-center-chat-list.module').then( m => m.CallCenterChatListPageModule),
    canActivate: [RolesGuard], 
    data: { 
      expectedRole: 'callcenter'
    } 
  },
  {
    path: 'users',
    loadChildren: () => import('./user-crud/user-crud.module').then( m => m.UserCrudPageModule)
  },
  {
    path: '**',
    redirectTo: 'chat-list',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
