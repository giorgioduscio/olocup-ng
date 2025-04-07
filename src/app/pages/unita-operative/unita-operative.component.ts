import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { NavbarNavigazioneComponent } from "../../components/navbar-navigazione/navbar-navigazione.component";
import { ModalComponent } from '../../components/modal/modal.component';
import { BackToTopComponent } from "../../components/back-to-top/back-to-top.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-unita-operative',
  standalone: true,
  imports: [ModalComponent, HeaderComponent, NavbarNavigazioneComponent, BackToTopComponent, FooterComponent],
  templateUrl: './unita-operative.component.html',
  styleUrl: './unita-operative.component.sass'
})
export class UnitaOperativeComponent {

}
