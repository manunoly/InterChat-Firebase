import { iRoutePage } from './routePage.model';

export const AdminRoutes: iRoutePage[] = [
  {
    title: 'Active Chat List',
    url: 'chat-list',
    icon: 'chatbubbles',
  },
  {
    title: 'Call Center Chat List',
    url: 'call-center-chat-list',
    icon: 'list-circle',
  },
  {
    title: 'Users in DB',
    url: 'users',
    icon: 'list-circle',
  },
  {
    title: 'Start new Chat',
    url: 'select-user-to-chat',
    icon: 'add-circle',
  },
  {
    title: 'Settings',
    url: 'settings',
    icon: 'settings',
  }
];
