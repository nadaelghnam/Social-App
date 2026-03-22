import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly myHttp = inject(HttpClient);

  getPostComment(postId: string): Observable<any> {
    return this.myHttp.get(`${environment.baseUrl}/posts/${postId}/comments?page=1&limit=10`);
  }

  createComment(postId: string, data: FormData | object): Observable<any> {
    return this.myHttp.post(`${environment.baseUrl}/posts/${postId}/comments`, data);
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.myHttp.delete(`${environment.baseUrl}/posts/${postId}/comments/${commentId}`);
  }

  updateComment(postId: string, commentId: string, body: any): Observable<any> {
    return this.myHttp.put(`${environment.baseUrl}/posts/${postId}/comments/${commentId}`, body);
  }


  likeComment(commentId: string): Observable<any> {
    return this.myHttp.patch(`${environment.baseUrl}/comments/${commentId}/like`, {});
  }


  createReply(postId: string, commentId: string, data: any): Observable<any> {
    return this.myHttp.post(`${environment.baseUrl}/posts/${postId}/comments/${commentId}/replies`, data);
  }
}
