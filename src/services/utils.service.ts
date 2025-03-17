import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS')
  }

  public generateDestinationImage(dest: string) {
    return `https://img.pequla.com/destination/${dest.split(' ')[0].toLowerCase()}.jpg`
  }
}
