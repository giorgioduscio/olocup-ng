import { Component, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Operator } from '../../interfaces/operator';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  constructor(public auth:AuthService){
    effect(() => {
      this.user = this.auth.user();
    });
  }
  user :Operator | null =null
}
