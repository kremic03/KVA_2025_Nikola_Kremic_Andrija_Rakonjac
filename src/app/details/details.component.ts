
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { ScreeningModel } from '../../models/screening.model';
import { MovieService } from '../../services/movie.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { SafePipe } from "../safe.pipe";
import { ReviewModel } from '../../models/review.model';
import { UserService } from '../../services/user.service';

interface ServiceResponse<T> {
  data: T;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    LoadingComponent,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    SafePipe,
    RouterLink
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  public movie: MovieModel | null = null;
  public screenings: ScreeningModel[] = [];
  public reviews: ReviewModel[] = [];
  public loading: boolean = true;
  
  constructor(private route: ActivatedRoute, public utils: UtilsService) {
    route.params.subscribe(params => {
      const movieId = +params['id']; 
      this.loadMovieDetails(movieId);
    });
  }

  async loadMovieDetails(movieId: number): Promise<void> {
    this.loading = true;
    
    try {
      //ucitava detalje filma
      const movieResponse = await MovieService.getMovieById(movieId) as ServiceResponse<MovieModel>;
      this.movie = movieResponse.data;
      
      // ucitava projekcije za ovaj film
      const screeningsResponse = await MovieService.getScreeningsForMovie(movieId) as ServiceResponse<ScreeningModel[]>;
      this.screenings = screeningsResponse.data;
      
      // prikazuje recencije za filmove koje smo selekotvali
      const reviewsResponse = await MovieService.getReviewsForMovie(movieId) as ServiceResponse<ReviewModel[]>;
      this.reviews = reviewsResponse.data;
    } catch (error) {
      console.error('Error loading movie details:', error);
    } finally {
      this.loading = false;
    }
  }
  
  get positiveReviews(): ReviewModel[] {
    return this.reviews.filter(review => review.rating === true);
  }
  
  get negativeReviews(): ReviewModel[] {
    return this.reviews.filter(review => review.rating === false);
  }
  
  // proverava da li je korisnik gledao ovaj film
  hasUserWatchedMovie(): boolean {
    const user = UserService.getActiveUser();
    if (!user || !this.movie) return false;
    
    return user.orders.some(order => 
      order.movieTitle === this.movie!.title && order.status === 'watched'
    );
  }
}
