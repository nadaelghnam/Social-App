import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-right.component.html',
  styleUrl: './side-right.component.css',
})
export class SideRightComponent implements OnInit {

  private readonly _authService = inject(AuthService);
  suggestedList: any[] = [];

  ngOnInit(): void {
    this.getSuggestedFriends();
  }

  getSuggestedFriends() {
    this._authService.getFriendSuggesition().subscribe({
      next: (res) => {
        this.suggestedList = res.data.suggestions.map((user: any) => ({
          ...user,
          isFollowed: false
        }));
      },
      error: (err) => console.error(err)
    });
  }

  followFriend(id: string) {
    const friend = this.suggestedList.find(f => f._id === id);
    if (!friend) return;

    friend.isFollowed = true;

    this._authService.doFollow(id).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.suggestedList = this.suggestedList.filter(f => f._id !== id);
        }, 800);
      },
      error: (err) => {
        console.error(err);
        friend.isFollowed = false;
      }
    });
  }
}
