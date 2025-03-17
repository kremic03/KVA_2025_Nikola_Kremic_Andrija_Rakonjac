// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { NgFor, NgIf } from '@angular/common';
import { AxiosError } from 'axios';
import { MovieModel } from '../../models/movie.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, MatButtonModule, MatCardModule, LoadingComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public movies: MovieModel[] | null = null;
  public error: string | null = null;
  public upcomingMovies: MovieModel[] | null = null;

  constructor(public utils: UtilsService) {
    this.loadMovies();
  }

  private async loadMovies() {
    try {
      // Load current movies (first 6)
      const response = await MovieService.getMovies(0, 6);
      this.movies = response.data;

      // Load upcoming movies (with release dates in the future)
      const allMoviesResponse = await MovieService.getMovies(0, 20);
      const today = new Date();
      this.upcomingMovies = allMoviesResponse.data
        .filter(movie => new Date(movie.startDate) > today)
        .slice(0, 4); // Take only 4 upcoming movies
    } catch (e: any) {
      this.error = `${e.code}: ${e.message}`;
    }
  }

  public getRecommendedMovies() {
    if (!this.movies) return [];
    
    const user = UserService.getActiveUser();
    
    if (!user || !user.favoriteGenre) return this.movies;
    
    // Filter movies by the user's favorite genre
    return this.movies.filter(movie => 
      movie.movieGenres.some(g => g.genre.name.toLowerCase() === user.favoriteGenre.toLowerCase())
    );
  }
}
