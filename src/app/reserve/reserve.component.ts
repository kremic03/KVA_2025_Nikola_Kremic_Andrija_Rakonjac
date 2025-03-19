
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { ScreeningModel } from '../../models/screening.model';
import { MovieService } from '../../services/movie.service';
import { UtilsService } from '../../services/utils.service';
import { MatCardModule } from '@angular/material/card';
import { NgClass, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../loading/loading.component";
import Swal from 'sweetalert2';

interface ServiceResponse<T> {
  data: T;
}

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [
    MatCardModule,
    NgIf,
    NgClass,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    LoadingComponent
  ],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.css'
})
export class ReserveComponent {
  public screening: ScreeningModel | null = null;
  public movie: MovieModel | null = null;
  public loading: boolean = true;
  
  public selectedTicketType: 'regular' | 'vip' | 'student' = 'regular';
  public selectedTicketCount: number = 1;
  
  // cene karata za razlicite tipove sedenja
  private priceMultipliers = {
    'regular': 1,
    'vip': 1.5,
    'student': 0.7
  };

  constructor(
    private route: ActivatedRoute, 
    public utils: UtilsService, 
    private router: Router
  ) {
    // provera da li je korisnik vec ulogovan ili je anonimni korisnik
    route.params.subscribe(params => {
      if (params['screeningId']) {
        // direktna rezervacija karata
        this.loadScreeningDetails(parseInt(params['screeningId']));
      } else if (params['id']) {
        // iz sekcije za detalje filmova prikazuje se rezervacija
        this.loadMovieScreenings(parseInt(params['id']));
      }
    });
  }

  private async loadScreeningDetails(screeningId: number): Promise<void> {
    this.loading = true;
    
    try {
      // uzima podatke o projekciji
      const screeningResponse = await MovieService.getScreeningById(screeningId) as ServiceResponse<ScreeningModel | null>;
      this.screening = screeningResponse.data;
      
      if (this.screening) {
        // uzima podatke o filmu
        const movieResponse = await MovieService.getMovieById(this.screening.movieId) as ServiceResponse<MovieModel>;
        this.movie = movieResponse.data;
      }
    } catch (error) {
      console.error('Error loading screening details:', error);
      // prikazuje poruku o gresci
      Swal.fire({
        title: "Error",
        text: "Failed to load screening details",
        icon: "error"
      });
    } finally {
      this.loading = false;
    }
  }

  private async loadMovieScreenings(movieId: number): Promise<void> {
    this.loading = true;
    
    try {
      //uzima podatke o filmu
      const movieResponse = await MovieService.getMovieById(movieId) as ServiceResponse<MovieModel>;
      this.movie = movieResponse.data;
      
      // uzima podatke o projekcijama
      const screeningsResponse = await MovieService.getScreeningsForMovie(movieId) as ServiceResponse<ScreeningModel[]>;
      const screenings = screeningsResponse.data;
      
      // proverava da li postoji samo jedna projekcija
      if (screenings.length === 1) {
        this.screening = screenings[0];
      } else if (screenings.length > 1) {
        // prikazuje poruku o izboru projekcije
        this.router.navigate(['/details', movieId]);
        return;
      } else {
        // prikazuje poruku o nepostojanju projekcija
        Swal.fire({
          title: "No Screenings",
          text: "There are no available screenings for this movie",
          icon: "info"
        });
        this.router.navigate(['/details', movieId]);
        return;
      }
    } catch (error) {
      console.error('Error loading movie screenings:', error);
      // prikazuje poruku o gresci
      Swal.fire({
        title: "Error",
        text: "Failed to load movie screenings",
        icon: "error"
      });
    } finally {
      this.loading = false;
    }
  }

  public getTicketPrice(): number {
    if (!this.screening) return 0;
    
    return this.screening.price * this.priceMultipliers[this.selectedTicketType];
  }

  public getTotalPrice(): number {
    return this.getTicketPrice() * this.selectedTicketCount;
  }

  public doReserve(): void {
    // provera da li je korisnik vec ulogovan
    if (!UserService.getActiveUser()) {
      // preusmerava korisnika na login stranicu
      const returnUrl = this.screening ? 
        `/reserve/${this.screening.id}` : 
        this.movie ? `/details/${this.movie.movieId}/reserve` : '/';
        
      this.router.navigate(['/login'], {
        queryParams: { returnUrl }
      });
      return;
    }

    // provera da li su podaci o projekciji i filmu dostupni
    if (!this.screening || !this.movie) {
      Swal.fire({
        title: "Error",
        text: "Missing screening or movie information",
        icon: "error"
      });
      return;
    }

    if (this.selectedTicketCount < 1) {
      Swal.fire({
        title: "Error",
        text: "Please select at least one ticket",
        icon: "error"
      });
      return;
    }

    if (this.selectedTicketCount > this.screening.availableSeats) {
      Swal.fire({
        title: "Error",
        text: `Only ${this.screening.availableSeats} seats available`,
        icon: "error"
      });
      return;
    }

    // potvrdjuje rezervaciju
    Swal.fire({
      title: `Reserve ${this.selectedTicketCount} tickets for ${this.movie.title}?`,
      text: "Reservations can be canceled or paid from your user profile!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reserve tickets!"
    }).then((result) => {
      if (result.isConfirmed) {
        // pravi rezervaciju
        const reservationResult = UserService.createOrder({
          id: new Date().getTime(),
          screeningId: this.screening!.id,
          movieTitle: this.movie!.title,
          date: this.screening!.date,
          time: this.screening!.time,
          hall: this.screening!.hall,
          count: this.selectedTicketCount,
          pricePerItem: this.getTicketPrice(),
          status: 'reserved',
          rating: null
        });

        if (reservationResult) {
          this.router.navigate(['/user']);
          Swal.fire({
            title: "Reservation Successful!",
            text: "You can view and manage your reservations in your profile.",
            icon: "success"
          });
        } else {
          Swal.fire({
            title: "Reservation Failed",
            text: "Something went wrong with your reservation!",
            icon: "error"
          });
        }
      }
    });
  }
}
