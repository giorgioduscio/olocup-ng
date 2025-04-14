import { Injectable, signal } from '@angular/core';

@Injectable({  providedIn: 'root' })
export class AuthService {
  constructor() { }

  user =signal<any>(null)
  
}
