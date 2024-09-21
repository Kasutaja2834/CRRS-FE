import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';
import{CommonModule} from '@angular/common'

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {
//reservationDTO: Re
  reservations: any[] = [];
  selectedReservation: any;

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations(): void {//by Minimmum
    console.log("Hakkame tooma reserveeringuid");
    this.reservationService.getReservations().subscribe((data) => {
      console.log('Received reservations:', data);  // Kontrollime, kas andmed tulevad ja on sobivas vormis
      this.reservations = data;
    });
  }

  selectReservation(reservation: any): void {
    this.selectedReservation = reservation;
  }

  issueCar(): void {
    this.reservationService.issueCar(this.selectedReservation.id).subscribe(() => {
      alert('Car issued successfully');
      this.getReservations();
    });
  }

  returnCar(): void {
    this.reservationService.returnCar(this.selectedReservation.id).subscribe(() => {
      alert('Car returned successfully');
      this.getReservations();
    });
  }
}


