import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaOperativeComponent } from './unita-operative.component';

describe('UnitaOperativeComponent', () => {
  let component: UnitaOperativeComponent;
  let fixture: ComponentFixture<UnitaOperativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitaOperativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitaOperativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
