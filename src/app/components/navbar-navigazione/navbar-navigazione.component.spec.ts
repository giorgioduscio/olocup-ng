import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarNavigazioneComponent } from './navbar-navigazione.component';

describe('NavbarNavigazioneComponent', () => {
  let component: NavbarNavigazioneComponent;
  let fixture: ComponentFixture<NavbarNavigazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarNavigazioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarNavigazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
