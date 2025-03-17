import { Component } from '@angular/core';
import { AirlineModel } from '../../models/airline.model';
import { AirlineService } from '../../services/airline.service';
import { MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-airline',
  imports: [MatTableModule, NgIf, MatButtonModule],
  templateUrl: './airline.component.html',
  styleUrl: './airline.component.css'
})
export class AirlineComponent {
  displayedColumns: string[] = ['id', 'name', 'countryOfOrigin', 'website', 'actions'];
  dataSource: AirlineModel[] = AirlineService.getAirlines()
}
