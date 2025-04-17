import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesBreadcrumbComponent } from './routes-breadcrumb.component';

describe('RoutesBreadcrumbComponent', () => {
  let component: RoutesBreadcrumbComponent;
  let fixture: ComponentFixture<RoutesBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesBreadcrumbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutesBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
