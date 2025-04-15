import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  constructor(private authService: AuthService) {
    const controls = this.fields.reduce((acc, field) => {
      (acc as Record<string, FormControl>)[field.name] = new FormControl(field.value, field.validators);
      return acc;
    }, {});

    this.form = new FormGroup(controls);    
  }

  form: FormGroup;
  fields =[
    { label: 'Email', 
      value:'',
      type: 'email', 
      name: 'email', 
      error: 'Deve contenere un indirizzo email valido', 
      validators: [Validators.required, Validators.email], 
    },
    { label: 'Password', 
      value:'',
      type: 'password', 
      name: 'password', 
      error: 'La password deve essere compresa tra 6 e 16 caratteri',
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(16)],
    },
  ]


  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
