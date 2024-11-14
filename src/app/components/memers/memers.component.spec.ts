import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemersComponent } from './memers.component';

describe('MemersComponent', () => {
  let component: MemersComponent;
  let fixture: ComponentFixture<MemersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
