import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsService } from '../../core/auth/services/posts.service';
import { Post } from '../../core/models/post.interface';
import { CommentComponent } from '../feed/components/feed-content/comment/comment.component';

@Component({
  selector: 'app-details',
  imports: [CommentComponent, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute)
  postService = inject(PostsService)
  postId: string = ""
  postDetails: Post = {} as Post
  userId: string = ""


  ngOnInit(): void {
    this.getId()
    this.userId = JSON.parse(localStorage.getItem("socialUser") as string)._id
  }

  getId() {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.postId = param.get('id') as string
      this.getPostDetails()

    })
  }

  getPostDetails() {
    this.postService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.postDetails = res.data.post
      }, error: (err) => {
        console.log(err);

      }
    })
  }
  timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 84600) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }


  deletePostItem(postId: string) {
    this.postService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
        }
      },
      error: (err) => {
        console.log(err);

      }
    })

  }



}


