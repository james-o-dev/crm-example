import { Injectable, inject } from '@angular/core'
import { AuthService } from '../../core/auth.service'
import { from } from 'rxjs'
import { getUsernameEndpoint, changeUsernameEndpoint } from '../../../assets/js/mock/user-profile.mock'

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private authService = inject(AuthService)

  public getUsername() {
    return from(getUsernameEndpoint(this.authService.accessToken))
  }

  public setUsername(username: string) {
    return from(changeUsernameEndpoint(this.authService.accessToken, username))
  }
}
