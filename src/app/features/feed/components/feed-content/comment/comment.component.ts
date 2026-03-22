import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentService } from './comment.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit, OnChanges {
  commentService = inject(CommentService);
  authService = inject(AuthService);

  @Input() postId: string = '';

  commentList: any[] = [];
  userInfo: any = null;
  userId: string = "";

  editingCommentId: string | null = null;
  activeReplyId: string | null = null;

  content = new FormControl('', [Validators.required]);
  editContent = new FormControl('', [Validators.required]);
  replyContent = new FormControl('', [Validators.required]);

  saveFile: File | null = null;
  imgUrl: string | ArrayBuffer | null | undefined = "";

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] && changes['postId'].currentValue) {
      this.getComments();
    }
  }

  loadUserData(): void {
    const userData = localStorage.getItem("socialUser");
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user?._id || "";
      this.userInfo = user;
    }
  }

  getComments(): void {
    if (!this.postId) return;
    this.commentService.getPostComment(this.postId).subscribe({
      next: (res: any) => {
        this.commentList = [...(res.comments || res.data?.comments || [])];
      },
      error: (err) => console.error("Error loading comments:", err)
    });
  }

  likeComment(commentId: string): void {
    this.commentService.likeComment(commentId).subscribe({
      next: () => this.getComments()
    });
  }

  toggleReply(commentId: string): void {
    this.activeReplyId = this.activeReplyId === commentId ? null : commentId;
    this.replyContent.reset();
  }

  submitReply(commentId: string): void {
    if (this.replyContent.invalid) return;
    const data = { content: this.replyContent.value };
    this.commentService.createReply(this.postId, commentId, data).subscribe({
      next: () => {
        this.activeReplyId = null;
        this.getComments();
      }
    });
  }

  submitForm(e: Event, form: HTMLFormElement): void {
    e.preventDefault();
    if (this.content.invalid && !this.saveFile) return;

    const formData = new FormData();
    if (this.content.value) formData.append('content', this.content.value);
    if (this.saveFile) formData.append('image', this.saveFile);

    this.commentService.createComment(this.postId, formData).subscribe({
      next: () => {
        form.reset();
        this.imgUrl = "";
        this.saveFile = null;
        this.getComments();
      }
    });
  }

  deleteCommentItem(postId: string, commentId: string): void {
    this.commentService.deleteComment(postId, commentId).subscribe({
      next: () => {
        this.commentList = this.commentList.filter(c => c._id !== commentId);
      }
    });
  }

  startEdit(comment: any): void {
    this.editingCommentId = comment._id;
    this.editContent.setValue(comment.content);
  }

  cancelEdit(): void {
    this.editingCommentId = null;
  }

  editCommentItem(commentId: string): void {
    if (this.editContent.invalid) return;
    this.commentService.updateComment(this.postId, commentId, { content: this.editContent.value }).subscribe({
      next: () => {
        this.editingCommentId = null;
        this.getComments();
      }
    });
  }

  changeImg(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.saveFile = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.saveFile);
      reader.onload = (e) => this.imgUrl = e.target?.result;
    }
  }

  timeAgo(dateStr: string): string {
    if (!dateStr) return 'now';
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }
}
