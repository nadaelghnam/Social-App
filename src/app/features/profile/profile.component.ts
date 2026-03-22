import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { LowerCasePipe } from '@angular/common';
import { FeedContentComponent } from "../feed/components/feed-content/feed-content.component";
import { Post } from '../../core/models/post.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FeedContentComponent, LowerCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private readonly _authService = inject(AuthService);

  userInfo: any = null;
  userPosts: Post[] = [];
  isLoading: boolean = true;
  userId: string = "";

  @Input() postsData: Post[] | null = null;

  get displayPosts(): Post[] {
    return this.postsData ? this.postsData : this.userPosts;
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.isLoading = true;
    this._authService.getLoggedUserInfo().subscribe({
      next: (res) => {
        if (res.data && res.data.user) {
          this.userInfo = res.data.user;
          this.userId = res.data.user._id;
          if (this.userId) {
            this.getUserPosts(this.userId);
          }
        }
      },
      error: (err) => {
        console.error('Error loading profile info:', err);
        this.isLoading = false;
      }
    });
  }

  getUserPosts(userId: string): void {
    this._authService.getUserPosts(userId).subscribe({
      next: (res) => {
        if (res.data && Array.isArray(res.data.posts)) {
          this.userPosts = res.data.posts.filter((post: any) => post.user._id === userId);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user posts:', err);
        this.isLoading = false;
      }
    });
  }

  handlePostDeleted(postId: string): void {
    this.userPosts = this.userPosts.filter(post => post._id !== postId);
  }

  handleNewPost(newPost: any): void {
    this.userPosts = [newPost, ...this.userPosts];
  }
}
