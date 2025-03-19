
import { Injectable } from '@angular/core';
import { GenreModel } from '../models/genre.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('sr-RS');
  }

  public formatDateTime(date: string, time: string) {
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(':');
    dateObj.setHours(parseInt(hours), parseInt(minutes));
    return dateObj.toLocaleString('sr-RS');
  }

  public formatGenres(genres: { genre: GenreModel }[]) {
    return genres.map(g => g.genre.name).join(', ');
  }

  public formatPrice(price: number) {
    return price.toFixed(2) + ' €';
  }

  public formatRuntime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  public generatePosterFallback(title: string) {
    // fall-back slika za filmove koji nemaju poster
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&size=256&background=random`;
  }

  public getStatusClass(status: string) {
    switch (status) {
      case 'reserved':
        return 'status-reserved';
      case 'paid':
        return 'status-paid';
      case 'watched':
        return 'status-watched';
      case 'canceled':
        return 'status-canceled';
      default:
        return '';
    }
  }
}
