import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<string>(''); // Hoiab teate väärtust
  notification$ = this.notificationSubject.asObservable(); // Jälgitav teade

  // Meetod teate seadmiseks
  setNotification(message: string): void {
    this.notificationSubject.next(message);
  }

  // Meetod teate tühjendamiseks
  clearNotification(): void {
    this.notificationSubject.next(''); // Tühjenda teade
  }
}

//Teenusega saab jagada teateid kõigi komponentide vahel, ilma et neid peaks käsitsi
// edasi andma. Lapsekomponendid saavad kasutada teenust, et saata sõnum AppComponent-ile.