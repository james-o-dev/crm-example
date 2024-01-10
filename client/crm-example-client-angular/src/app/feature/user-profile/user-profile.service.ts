import { Injectable } from '@angular/core'
import { changeUsernameEndpoint, getUsernameEndpoint } from '../../core/mock/user-profile.mock'
import { AuthService } from '../../core/auth.service'
import { from } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  constructor(private authService: AuthService) { }

  getUsername() {
    return from(getUsernameEndpoint(this.authService.accessToken))
  }

  setUsername(username: string) {
    return from(changeUsernameEndpoint(this.authService.accessToken, username))
  }
}
