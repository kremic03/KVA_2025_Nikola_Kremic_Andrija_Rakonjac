
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserModel } from '../../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { OrderModel } from '../../models/order.model';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MovieService } from '../../services/movie.service';
import { UtilsService } from '../../services/utils.service';
import Swal from 'sweetalert2';

interface ServiceResponse<T> {
  data: T;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    TitleCasePipe,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    RouterLink,
    MatExpansionModule,
    MatAccordion,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  public displayedColumns: string[] = ['movieTitle', 'screening', 'tickets', 'price', 'status', 'actions'];
  public user: UserModel | null = null;
  public userCopy: UserModel | null = null;
  public genreList: string[] = [];

  public oldPasswordValue = '';
  public newPasswordValue = '';
  public repeatPasswordValue = '';

  constructor(private router: Router, public utils: UtilsService) {
    if (!UserService.getActiveUser()) {
      // korisnik nije ulogovan, preusmeri ga na login stranicu
      router.navigate(['/login']);
      return;
    }

    this.user = UserService.getActiveUser();
    this.userCopy = JSON.parse(JSON.stringify(this.user)); 
    
    // ucitavanje zanrova filmova
    MovieService.getGenres()
      .then((response: ServiceResponse<string[]>) => this.genreList = response.data)
      .catch(() => this.genreList = ['Drama', 'Comedy', 'Action', 'Horror', 'Science Fiction']); 
  }

  public doChangePassword(): void {
    if (this.oldPasswordValue === '' || this.newPasswordValue === '') {
      Swal.fire({
        title: "Error",
        text: "Password fields cannot be empty",
        icon: "error"
      });
      return;
    }

    if (this.newPasswordValue !== this.repeatPasswordValue) {
      Swal.fire({
        title: "Error",
        text: "New passwords don't match",
        icon: "error"
      });
      return;
    }

    if (this.oldPasswordValue !== this.user?.password) {
      Swal.fire({
        title: "Error",
        text: "Current password is incorrect",
        icon: "error"
      });
      return;
    }

    if (UserService.changePassword(this.newPasswordValue)) {
      Swal.fire({
        title: "Success",
        text: "Password has been changed successfully",
        icon: "success"
      });
      this.oldPasswordValue = '';
      this.newPasswordValue = '';
      this.repeatPasswordValue = '';
    } else {
      Swal.fire({
        title: "Error",
        text: "Failed to change password",
        icon: "error"
      });
    }
  }

  public doUpdateUser(): void {
    if (this.userCopy == null) {
      Swal.fire({
        title: "Error",
        text: "User information is not available",
        icon: "error"
      });
      return;
    }

    if (UserService.updateUser(this.userCopy)) {
      this.user = UserService.getActiveUser();
      Swal.fire({
        title: "Success",
        text: "Profile updated successfully",
        icon: "success"
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Failed to update profile",
        icon: "error"
      });
    }
  }

  public doPay(order: OrderModel): void {
    Swal.fire({
      title: "Confirm Payment",
      text: `Are you sure you want to pay for ${order.count} tickets for "${order.movieTitle}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, pay now"
    }).then((result) => {
      if (result.isConfirmed) {
        if (UserService.changeOrderStatus('paid', order.id)) {
          this.user = UserService.getActiveUser();
          Swal.fire({
            title: "Payment Successful",
            text: "Your tickets have been confirmed",
            icon: "success"
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Payment failed",
            icon: "error"
          });
        }
      }
    });
  }

  public doCancel(order: OrderModel): void {
    Swal.fire({
      title: "Cancel Reservation",
      text: `Are you sure you want to cancel your reservation for "${order.movieTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it"
    }).then((result) => {
      if (result.isConfirmed) {
        if (UserService.changeOrderStatus('canceled', order.id)) {
          this.user = UserService.getActiveUser();
          Swal.fire({
            title: "Reservation Canceled",
            text: "Your reservation has been canceled",
            icon: "success"
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to cancel reservation",
            icon: "error"
          });
        }
      }
    });
  }

  public markAsWatched(order: OrderModel): void {
    Swal.fire({
      title: "Mark as Watched",
      text: `Mark "${order.movieTitle}" as watched?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I've watched it"
    }).then((result) => {
      if (result.isConfirmed) {
        if (UserService.changeOrderStatus('watched', order.id)) {
          this.user = UserService.getActiveUser();
          Swal.fire({
            title: "Marked as Watched",
            text: "You can now rate this movie",
            icon: "success"
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to update status",
            icon: "error"
          });
        }
      }
    });
  }

  public doRating(order: OrderModel, rating: boolean): void {
    const ratingText = rating ? "liked" : "disliked";
    
    Swal.fire({
      title: "Rate Movie",
      text: `You have ${ratingText} "${order.movieTitle}"`,
      icon: "success",
      timer: 1500
    });
    
    if (UserService.changeRating(rating, order.id)) {
      this.user = UserService.getActiveUser();
    }
  }

  public getStatusClass(status: string): string {
    return `status-${status}`;
  }
}
