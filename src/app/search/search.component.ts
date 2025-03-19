
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MovieModel } from '../../models/movie.model';
import { NgFor, NgIf } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MatButtonModule } from '@angular/material/button';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-search',
  imports: [
    MatTableModule,
    NgIf,
    NgFor,
    MatButtonModule,
    LoadingComponent,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatSliderModule,
    MatChipsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  displayedColumns: string[] = ['poster', 'title', 'director', 'genres', 'duration', 'actions'];
  allData: MovieModel[] | null = null;
  dataSource: MovieModel[] | null = null;
  
  // Filter 
  genreList: string[] = [];
  selectedGenre: string | null = null;
  directorList: string[] = [];
  selectedDirector: string | null = null;
  actorList: string[] = [];
  selectedActor: string | null = null;
  releaseYears: string[] = [];
  selectedYear: string | null = null;
  userInput: string = '';
  
  // trajanje
  minDuration: number = 0;
  maxDuration: number = 300;
  selectedDurationRange: [number, number] = [0, 300];

  constructor(public utils: UtilsService) {
   
    MovieService.getMovieList()
      .then(response => {
        this.allData = response.data;
        this.dataSource = response.data;
        this.generateSearchCriteria(response.data);
      });
  }

  generateSearchCriteria(source: MovieModel[]) {
    
    const allGenres = source.flatMap(movie => movie.movieGenres.map(g => g.genre.name));
    this.genreList = [...new Set(allGenres)];
    
    
    this.directorList = [...new Set(source.map(movie => movie.director.name))];
    
  
    const allActors = source.flatMap(movie => movie.movieActors.map(a => a.actor.name));
    this.actorList = [...new Set(allActors)];
    
    
    const years = source.map(movie => new Date(movie.startDate).getFullYear().toString());
    this.releaseYears = [...new Set(years)].sort((a, b) => b.localeCompare(a)); 
    
   
    this.minDuration = Math.min(...source.map(movie => movie.runTime));
    this.maxDuration = Math.max(...source.map(movie => movie.runTime));
    this.selectedDurationRange = [this.minDuration, this.maxDuration];
  }

  doReset() {
    this.userInput = '';
    this.selectedGenre = null;
    this.selectedDirector = null;
    this.selectedActor = null;
    this.selectedYear = null;
    this.selectedDurationRange = [this.minDuration, this.maxDuration];
    this.dataSource = this.allData;
    
    if (this.allData) {
      this.generateSearchCriteria(this.allData);
    }
  }

  doFilterChain() {
    if (this.allData == null) return;

    this.dataSource = this.allData
      .filter(movie => {
        
        if (this.userInput === '') return true;
        const searchLower = this.userInput.toLowerCase();
        return movie.title.toLowerCase().includes(searchLower) ||
               movie.description.toLowerCase().includes(searchLower) ||
               movie.shortDescription.toLowerCase().includes(searchLower);
      })
      .filter(movie => {
        
        if (this.selectedGenre == null) return true;
        return movie.movieGenres.some(g => g.genre.name === this.selectedGenre);
      })
      .filter(movie => {
        
        if (this.selectedDirector == null) return true;
        return movie.director.name === this.selectedDirector;
      })
      .filter(movie => {
        
        if (this.selectedActor == null) return true;
        return movie.movieActors.some(a => a.actor.name === this.selectedActor);
      })
      .filter(movie => {
        
        if (this.selectedYear == null) return true;
        const movieYear = new Date(movie.startDate).getFullYear().toString();
        return movieYear === this.selectedYear;
      })
      .filter(movie => {
       
        return movie.runTime >= this.selectedDurationRange[0] && 
               movie.runTime <= this.selectedDurationRange[1];
      });
  }
}
