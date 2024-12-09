import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternregisterComponent } from './internregister.component';

describe('InternregisterComponent', () => {
  let component: InternregisterComponent;
  let fixture: ComponentFixture<InternregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
