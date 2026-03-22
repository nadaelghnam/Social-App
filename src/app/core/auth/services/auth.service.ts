import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  myHttp = inject(HttpClient);
  router = inject(Router)

  register(data: object): Observable<any> {
    return this.myHttp.post(environment.baseUrl + '/users/signup', data)
  }

  login(data: object): Observable<any> {
    return this.myHttp.post(environment.baseUrl + '/users/signin', data)
  }

  logOut(): void {
    localStorage.removeItem("userToken")
    this.router.navigate(['/login'])
  }

  getFriendSuggesition(): Observable<any> {
    return this.myHttp.get(environment.baseUrl + `/users/suggestions?limit=10`)
  }

  doFollow(userId: string): Observable<any> {
    return this.myHttp.put(environment.baseUrl + `/users/${userId}/follow`, null)
  }

  changePassword(data: object): Observable<any> {
    return this.myHttp.patch(environment.baseUrl + `/users/change-password`, data);
  }


 getLoggedUserInfo(): Observable<any> {
  return this.myHttp.get(environment.baseUrl+`/users/profile-data`);
}

getUserPosts(userId: string): Observable<any> {
  return this.myHttp.get(environment.baseUrl+`/users/${userId}/posts`);
}

}
