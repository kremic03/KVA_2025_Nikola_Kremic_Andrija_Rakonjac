import { Component } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { NgFor, NgIf } from '@angular/common';
import { AxiosError } from 'axios';
import { FlightModel } from '../../models/flight.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, MatButtonModule, MatCardModule, LoadingComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public flights: FlightModel[] | null = null
  public error: string | null = null

  constructor(public utils: UtilsService) {
    FlightService.getFlights(0, 9)
      .then(rsp => {
        this.flights = rsp.data.content
        for (let f of this.flights!) {
          f.temperature = Math.floor(Math.random() * (35 - 12 + 1) + 12)
        }
      })
      .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`)
  }
}
