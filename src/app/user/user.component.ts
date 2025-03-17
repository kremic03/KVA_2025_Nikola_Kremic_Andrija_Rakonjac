import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
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
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-user',
  imports: [
    NgIf,
    NgFor,
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
  public displayedColumns: string[] = ['id', 'destination', 'flightNumber', 'airline', 'count', 'price', 'total', 'status', 'actions'];
  public user: UserModel | null = null
  public userCopy: UserModel | null = null
  public destinationList: string[] = []

  public oldPasswordValue = ''
  public newPasswordValue = ''
  public repeatPasswordValue = ''

  constructor(private router: Router) {
    if (!UserService.getActiveUser()) {
      // Korisnik aplikacije nije ulogovan
      // Vrati korisnika na homepage
      router.navigate(['/home'])
      return
    }

    this.user = UserService.getActiveUser()
    this.userCopy = UserService.getActiveUser()
    FlightService.getDestinations()
      .then(rsp => this.destinationList = rsp.data)
  }

  public doChangePassword() {
    if (this.oldPasswordValue == '' || this.newPasswordValue == null) {
      alert('Password cant be empty')
      return
    }

    if (this.newPasswordValue !== this.repeatPasswordValue) {
      alert('Password dont match')
      return
    }

    if (this.oldPasswordValue !== this.user?.password) {
      alert('Password dont match')
      return
    }

    alert(
      UserService.changePassword(this.newPasswordValue) ?
        'Password has been changed' : 'Failed to change password'
    )

    this.oldPasswordValue = ''
    this.newPasswordValue = ''
    this.repeatPasswordValue = ''
  }

  public doUpdateUser() {
    if (this.userCopy == null) {
      alert('User not defined')
      return
    }

    UserService.updateUser(this.userCopy)
    this.user = UserService.getActiveUser()
    alert('User was updated')
  }

  public doPay(order: OrderModel) {
    if (UserService.changeOrderStatus('paid', order.id)) {
      this.user = UserService.getActiveUser()
    }
  }

  public doCancel(order: OrderModel) {
    if (UserService.changeOrderStatus('canceled', order.id)) {
      this.user = UserService.getActiveUser()
    }
  }

  public doRating(order: OrderModel, r: boolean) {
    if (UserService.changeRating(r, order.id)) {
      this.user = UserService.getActiveUser()
    }
  }
}
