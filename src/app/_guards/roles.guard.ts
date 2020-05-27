import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService, 
    private router: Router,
    private utilService: UtilService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;

    if (this.authService.userSesion.value && this.authService.userSesion.value.type !== expectedRole) {

      this.authService.logout();
      this.utilService.showToast('You do not have access permissions to that route' , 4000);
      this.utilService.showAlert('ATENTION' , 'You do not have access permissions to that route');

    } else {
      return true;
    }
  }
}
