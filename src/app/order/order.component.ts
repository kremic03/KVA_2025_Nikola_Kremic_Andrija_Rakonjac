import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightModel } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';
import { UtilsService } from '../../services/utils.service';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AirlineModel } from '../../models/airline.model';
import { AirlineService } from '../../services/airline.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  imports: [MatCardModule, NgIf, NgFor, MatInputModule, MatButtonModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  public flight: FlightModel | null = null
  public airlines: AirlineModel[] = AirlineService.getAirlines()
  public selectedAirline: number = this.airlines[0].id
  public selectedTicketCount: number = 1
  public selectedPrice: number = 150

  public constructor(private route: ActivatedRoute, public utils: UtilsService, private router: Router) {
    route.params.subscribe(params => {
      FlightService.getFlightById(params['id'])
        .then(rsp => {
          this.flight = rsp.data
        })
    })
  }

  public doOrder() {
    Swal.fire({
      title: `Place an order to ${this.flight?.destination}?`,
      text: "Orders can be canceled any time from your user profile!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        popup: 'bg-dark'
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place an order!"
    }).then((result) => {
      if (result.isConfirmed) {
        const result = UserService.createOrder({
          id: new Date().getTime(),
          flightId: this.flight!.id,
          flightNumber: this.flight!.flightNumber,
          destination: this.flight!.destination,
          airline: AirlineService.getAirlineById(this.selectedAirline)!,
          count: this.selectedTicketCount,
          pricePerItem: this.selectedPrice,
          status: 'ordered',
          rating: null
        })
        result ? this.router.navigate(['/user']) :
          Swal.fire({
            title: "Failed crating an order",
            text: "Something is wrong with your order!",
            icon: "error"
          });
      }
    })
  }
}
