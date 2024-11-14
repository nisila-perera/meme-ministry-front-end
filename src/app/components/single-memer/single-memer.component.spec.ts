import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMemerComponent } from './single-memer.component';

describe('SingleMemerComponent', () => {
  let component: SingleMemerComponent;
  let fixture: ComponentFixture<SingleMemerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleMemerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleMemerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
