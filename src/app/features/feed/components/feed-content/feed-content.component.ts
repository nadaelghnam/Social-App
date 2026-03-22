import { Component, ElementRef, inject, OnInit, ViewChild, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { PostsService } from '../../../../core/auth/services/posts.service';
import { Post } from '../../../../core/models/post.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentComponent } from './comment/comment.component';
import { RouterLink } from '@angular/router';
import { Modal } from 'flowbite';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-feed-content',
  standalone: true,
  imports: [ReactiveFormsModule, CommentComponent, LowerCasePipe, RouterLink],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit, AfterViewInit {
  private readonly _postService = inject(PostsService);
  private readonly _authService = inject(AuthService);

  @Input() postsData: Post[] | null = null;

  @Output() fireDelete = new EventEmitter<string>();
  @Output() fireLike = new EventEmitter<void>();
  @Output() fireSave = new EventEmitter<void>();

  @ViewChild('modal') modalElement!: ElementRef;

  private modal!: Modal;
  userId: string = "";
  postList: Post[] = [];
  currentPost: Post | null = null;
  isEditMode: boolean = false;
  userInfo: any = null;
  isLoading: boolean = true;
  saveFile!: File;
  imgUrl: string | ArrayBuffer | null | undefined;

  privacy = new FormControl("public");
  body = new FormControl("", [Validators.minLength(3), Validators.maxLength(300)]);

  get displayPosts(): Post[] {
    return this.postsData ? this.postsData : this.postList;
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadProfileData();

    if (!this.postsData) {
      this.getAllPostsData();
    }
  }

  ngAfterViewInit(): void {
    if (this.modalElement) {
      this.modal = new Modal(this.modalElement.nativeElement);
    }
  }

  loadUserData(): void {
    const userData = localStorage.getItem("socialUser");
    if (userData) {
      this.userId = JSON.parse(userData)._id;
    }
  }

  loadProfileData(): void {
    this.isLoading = true;
    this._authService.getLoggedUserInfo().subscribe({
      next: (res) => {
        if (res.data && res.data.user) {
          this.userInfo = res.data.user;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getAllPostsData(): void {
    this.isLoading = true;
    this._postService.getAllPosts().subscribe({
      next: (res) => {
        this.postList = res.data.posts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching posts:", err);
        this.isLoading = false;
      }
    });
  }

  openModal(post: Post): void {
    this.isEditMode = false;
    this.currentPost = post;
    this.body.reset();
    this.modal.show();
  }

  openEditModal(post: Post): void {
    this.isEditMode = true;
    this.currentPost = post;
    this.body.setValue(post.body);
    this.modal.show();
  }

  closeModal(): void {
    this.modal.hide();
    this.currentPost = null;
    this.isEditMode = false;
    this.body.reset();
  }

  editPostItem(): void {
    if (!this.currentPost || !this.body.value) return;
    const postId = this.currentPost._id;
    const newValue = this.body.value;
    const formData = new FormData();
    formData.append('body', newValue);

    this._postService.updatePost(formData, postId).subscribe({
      next: () => {
        const targetList = this.postsData ? this.postsData : this.postList;
        const index = targetList.findIndex(p => p._id === postId);
        if (index !== -1) {
          targetList[index].body = newValue;
        }
        this.closeModal();
      },
      error: (err) => console.error("API Error:", err)
    });
  }

  deletePostItem(postId: string): void {
    this._postService.deletePost(postId).subscribe({
      next: () => {
        this.fireDelete.emit(postId);
      },
      error: (err) => console.error("Delete Error:", err)
    });
  }

  likeOrUnlikePost(postId: string): void {
    this._postService.likeOrUnlike(postId).subscribe({
      next: () => {
        if (!this.postsData) {
          this.getAllPostsData();
        } else {
          this.fireLike.emit();
        }
      },
      error: (err) => console.error("Like Error:", err)
    });
  }

  saveOrUnsavePost(postId: string): void {
    this._postService.saveOrUnsave(postId).subscribe({
      next: () => {
        if (!this.postsData) {
          this.getAllPostsData();
        } else {
          this.fireSave.emit();
        }
      },
      error: (err) => console.error("Save Error:", err)
    });
  }

  submitForm(e: Event, form: HTMLFormElement): void {
    e.preventDefault();
    if (this.body.invalid) return;

    const formData = new FormData();
    if (this.body.value) formData.append('body', this.body.value);
    if (this.saveFile) formData.append('image', this.saveFile);
    if (this.privacy.value) formData.append('privacy', this.privacy.value);

    this._postService.createPost(formData).subscribe({
      next: (res) => {
        if (res.success) {
          form.reset();
          this.imgUrl = "";
          if (!this.postsData) this.getAllPostsData();
        }
      }
    });
  }

  changeImg(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.saveFile = input.files[0];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.saveFile);
      fileReader.onload = (e) => { this.imgUrl = e.target?.result; };
    }
  }

  closeImgUrl(): void { this.imgUrl = ""; }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }
}
