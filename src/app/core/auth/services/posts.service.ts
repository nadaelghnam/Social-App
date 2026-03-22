import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  myHttp = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this.myHttp.get(environment.baseUrl + `/posts`);
  }

  createPost(data: any): Observable<any> {
    return this.myHttp.post(environment.baseUrl + `/posts`, data);
  }

  getSinglePost(postId: string):Observable<any>{
    return this.myHttp.get(environment.baseUrl + `/posts/${postId}`);
  }
  deletePost(postId: string): Observable<any> {
    return this.myHttp.delete(environment.baseUrl + `/posts/${postId}`);
  }

  likeOrUnlike(postId: string): Observable<any> {
    return this.myHttp.put(environment.baseUrl + `/posts/${postId}/like`, null);
  }

  saveOrUnsave(postId: string): Observable<any> {
    return this.myHttp.put(environment.baseUrl + `/posts/${postId}/bookmark`, null);
  }

  sharePosts(body: any, postId: string): Observable<any> {
    return this.myHttp.post(environment.baseUrl + `/posts/${postId}/share`, body);
  }

  updatePost(body: any, postId: string): Observable<any> {
    return this.myHttp.put(environment.baseUrl + `/posts/${postId}`, body);
  }
}
