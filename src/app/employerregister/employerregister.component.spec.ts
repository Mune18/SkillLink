import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerregisterComponent } from './employerregister.component';

describe('EmployerregisterComponent', () => {
  let component: EmployerregisterComponent;
  let fixture: ComponentFixture<EmployerregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
