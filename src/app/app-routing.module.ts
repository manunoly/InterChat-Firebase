import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat-list',
    pathMatch: 'full'
  },
  {
    path: 'chat-list',
    loadChildren: () => import('./chat-list/chat-list.module').then( m => m.ChatListPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat-list/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
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
export class AppRoutingModule {}
