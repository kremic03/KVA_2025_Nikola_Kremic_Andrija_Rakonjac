import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FlightModel } from '../../models/flight.model';
import { NgFor, NgIf } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { MatButtonModule } from '@angular/material/button';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  displayedColumns: string[] = ['id', 'destination', 'flightNumber', 'scheduledAt', 'actions'];
  allData: FlightModel[] | null = null
  destinationList: string[] = []
  selectedDestination: string | null = null
  dataSource: FlightModel[] | null = null
  flightNumberList: string[] = []
  selectedFlightNumber: string | null = null
  userInput: string = ''
  dateOptions: string[] = []
  selectedDate: string | null = null

  public constructor(public utils: UtilsService) {
    FlightService.getFlightList()
      .then(rsp => {
        this.allData = rsp.data
        this.dataSource = rsp.data
        this.generateSearchCriteria(rsp.data)
      })
  }

  public generateSearchCriteria(source: FlightModel[]) {
    this.destinationList = source.map(obj => obj.destination)
      .filter((dest: string, i: number, ar: any[]) => ar.indexOf(dest) === i)
    this.flightNumberList = source.map(obj => obj.flightNumber)
      .filter((num: string, i: number, ar: any[]) => ar.indexOf(num) === i)
    this.dateOptions = source.map(obj => obj.scheduledAt)
      .map((obj: string) => obj.split('T')[0])
      .filter((date: string, i: number, ar: any[]) => ar.indexOf(date) === i)
  }

  public doReset() {
    this.userInput = ''
    this.selectedDestination = null
    this.selectedFlightNumber = null
    this.selectedDate = null
    this.dataSource = this.allData
    this.generateSearchCriteria(this.allData!)
  }

  public doFilterChain() {
    if (this.allData == null) return

    this.dataSource = this.allData!
      .filter(obj => {
        // Input Field Search
        if (this.userInput == '') return true
        return obj.destination.toLowerCase().includes(this.userInput) ||
          obj.id.toString().includes(this.userInput) ||
          obj.flightNumber.includes(this.userInput)
      })
      .filter(obj => {
        // Destintination Search
        if (this.selectedDestination == null) return true
        return obj.destination === this.selectedDestination
      })
      .filter(obj => {
        // Flight Number Search
        if (this.selectedFlightNumber == null) return true
        return obj.flightNumber === this.selectedFlightNumber
      })
      .filter(obj => {
        // Date Search
        if (this.selectedDate == null) return true
        const start = new Date(`${this.selectedDate}T00:00:01`)
        const end = new Date(`${this.selectedDate}T23:59:59`)
        const scheduled = new Date(obj.scheduledAt)

        return (start <= scheduled) && (scheduled <= end)
      })

    this.generateSearchCriteria(this.dataSource)
  }
}
