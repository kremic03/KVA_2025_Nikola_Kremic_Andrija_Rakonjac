
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  imports: [MatCardModule, NgFor, RouterLink, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public genreList: string[] = [];
  public email = '';
  public password = '';
  public repeatPassword = '';
  public firstName = '';
  public lastName = '';
  public phone = '';
  public address = '';
  public favoriteGenre = '';

  constructor(private router: Router) {
    
    this.loadGenres();
  }

  private async loadGenres() {
    try {
      const response = await MovieService.getGenres();
      this.genreList = response.data;
    } catch (error) {
      console.error('Error loading genres:', error);
      this.genreList = ['Drama', 'Comedy', 'Action', 'Horror', 'Science Fiction']; 
    }
  }

  public doSignup() {
    
    if (this.email === '' || this.password === '') {
      Swal.fire({
        title: "Error",
        text: "Email and password are required fields",
        icon: "error"
      });
      return;
    }

    if (this.password !== this.repeatPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords don't match",
        icon: "error"
      });
      return;
    }

    if (this.firstName === '' || this.lastName === '') {
      Swal.fire({
        title: "Error",
        text: "First name and last name are required",
        icon: "error"
      });
      return;
    }

    // pravi novog korisnika
    const result = UserService.createUser({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      address: this.address,
      favoriteGenre: this.favoriteGenre,
      orders: []
    });

    if (result) {
      Swal.fire({
        title: "Success",
        text: "Your account has been created successfully. You can now log in.",
        icon: "success"
      });
      this.router.navigate(['/login']);
    } else {
      Swal.fire({
        title: "Error",
        text: "This email is already registered",
        icon: "error"
      });
    }
  }
}
