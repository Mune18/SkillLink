import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TimeAgoPipe } from '../home/time-ago.pipe';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommentThreadComponent } from '../comment-thread/comment-thread.component';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [RouterModule,MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    TimeAgoPipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
     MatInputModule,
     RouterModule,
     CommentThreadComponent,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  forum: any;
  forumUser: any;
  recentForums: any[] = [];
  forums: any[] = [];
  topForums: any[] = [];
  userData: any = {};
  userRoleData: any = {};
  isDropdownOpen = false;
  stateData: any = {};
  isFormVisible = false;
  commentText = '';
  commentForm: FormGroup;
  replyForm: FormGroup;
  comments: any[]= [];
  visibleFormId: number | null = null;
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required,]],
    })

    this.replyForm = this.fb.group({
      reply: ['', Validators.required],
    });

  }


  ngOnInit(): void {
    this.stateData = history.state;

    if (this.stateData?.forum) {

        this.forum = this.stateData.forum;
        this.forumUser = this.stateData.userData;
        console.log('Forum:', this.forum);
        console.log('userData:', this.stateData);
        console.log('Post ID:', this.stateData.postId);
    } else {
        console.warn('No forum data received.');
    }
    this.fetchUserData();
    this.getForums();
    this.getComments(this.forum.id);
}



showForm(commentId: number): void {
  this.isFormVisible = true; // Show the form
  this.visibleFormId = commentId; // Set the ID of the comment where the form should appear
}
showFormComment(commentId: number): void {
  this.visibleFormId = commentId; // Set the ID of the comment where the form should appear
}

cancelForm(): void {
  this.visibleFormId = null; // Clear the visible form
  this.isFormVisible = false;
  this.commentForm.reset(); // Reset the form

}

submitComment():void {
    if(this.commentForm.valid) {
       const formData = new FormData();
        formData.append('forum_id', this.forum.id);
        formData.append('user_id', this.userData.id);
        formData.append('comment', this.commentForm.get('comment')?.value);

        this.authService.addComment(formData).subscribe({
            next: (response) => {
                console.log('Comment added successfully:', response);
                this.getForums();


                this.isFormVisible = false;
                this.commentForm.reset();
                this.commentText = '';
                this.getComments(this.forum.id);
                this.forum.comments_count++;
            },
            error: (error) => {
                console.error('Failed to add comment:', error);
                if (error.status === 401) {
                    this.router.navigate(['/login']);
                }
            },
        });
    }
}

submitReply(commentId: number, forumId:number): void {
  if (this.replyForm.valid) {
    const formData = new FormData();
    formData.append('parent_id', commentId.toString());
    formData.append('user_id', this.userData.id);
    formData.append('forum_id', forumId.toString());
    formData.append('comment', this.replyForm.get('reply')?.value);

    this.authService.addReply(formData).subscribe({
      next: (response) => {
        console.log('Reply added successfully:', response);
        this.getComments(this.forum.id); // Refresh comments to include the new reply
        this.visibleFormId = null; // Hide the form
        this.replyForm.reset();
      },
      error: (error) => {
        console.error('Failed to add reply:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });
  }
}

// commentOnComment(comment: any): void {
//     this.commentText = `@${comment.user.name} `;
//     this.isFormVisible = true;
// }

getComments(forumId: number): void {
  this.authService.getComments(forumId).subscribe({
    next: (response) => {
      this.comments = response.data
        .map((comment: any) => this.processComment(comment))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      console.log('Comments retrieved:', this.comments);
    },
    error: (error) => {
      console.error('Failed to fetch comments:', error);
    },
  });
}

private processComment(comment: any): any {
  return {
    ...comment,
    user: comment.user,
    replies: (comment.replies || [])
      .map((reply: any) => this.processComment({
        ...reply,
        user: reply.user || comment.user
      }))
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort replies by date
  };
}

private getReplies(allComments: any[], parentId: number): any[] {
  const directReplies = allComments.filter(comment => comment.parent_id === parentId);
  console.log(`Direct replies for parent ${parentId}:`, directReplies); // Log direct replies

  return directReplies.map(reply => ({
    ...reply,
    replies: this.getReplies(allComments, reply.id)
  }));
}




goBack(): void {
  this.router.navigate(['/home']); // Navigates back to homepage
}

  fetchUserData(): void {
    const userId = this.authService.getID();
    if (userId) {
      this.authService.getMyData(+userId).subscribe({
        next: (response) => {
          this.userRoleData = response.intern_profile? response.intern_profile : response.recruiter_profile;
          this.userData = response.user;
          console.log('User data fetched successfully:', response);
          console.log("my data:", this.userData)
          // this.userProfileImage = `${this.authService.apiUrl}${this.userData.profile_image}`;
        },
        error: (error) => {
          console.error('Failed to fetch user data:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      console.error('No user ID found in local storage.');
      this.router.navigate(['/login']);
    }
  }

  getLoggedInUserId(): number {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    return user.id;
  }

  getForums() {
    this.authService.getForums().subscribe({
      next: (response) => {
        const userId = this.getLoggedInUserId();
        this.topForums = response.top_posts;
        this.recentForums = response.posts.slice(0, 2);
        this.forums = response.posts.map((forum: any) => ({
          ...forum,
          isLiked: forum.likes.some((like: any) => like.user_id === userId), // Check if the user has already liked the post
        }));
        console.log("Top post", this.topForums)
        console.log('Forums retrieved:', this.forums);
      },
      error: (error) => {
        console.error('Error retrieving forums:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  commentPost(postId: number, forum: any): void {
    this.router.navigate(['/home'])
    this.router.navigate(['/comments'], { state: { forum, postId } });
  }

  likePost(forumId: number, forum: any): void {
    if (forum.isLiked) {
      console.warn('Post is already liked.');
      return;
    }

    const data = { forum_id: forumId, user_id: this.authService.getID() };

    // Optimistic update
    const previousLikesCount = forum.likes_count;
    forum.likes_count++;
    forum.isLiked = true;

    this.authService.likePost(data).subscribe({
      next: (response: any) => {
        console.log('Like successful:', response);
      },
      error: (error: any) => {
        console.error('Error liking the post:', error);
        // Rollback changes if the API call fails
        forum.likes_count = previousLikesCount;
        forum.isLiked = false;

        if (error.status === 403) {
          console.warn('You have already liked this post.');
        }
      },
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.isDropdownOpen = false; // Close the dropdown after navigating
  }

  Logout() {
    this.router.navigate(['/login']);
    this.authService.clearLoginData();
    this.isDropdownOpen = false; // Close the dropdown after navigating
  }
}
