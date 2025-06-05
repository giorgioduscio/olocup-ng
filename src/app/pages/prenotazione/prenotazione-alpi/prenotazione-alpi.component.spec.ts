import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenotazioneAlpiComponent } from './prenotazione-alpi.component';

describe('PrenotazioneAlpiComponent', () => {
  let component: PrenotazioneAlpiComponent;
  let fixture: ComponentFixture<PrenotazioneAlpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenotazioneAlpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrenotazioneAlpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
