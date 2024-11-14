import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSavedMemeComponent } from './single-saved-meme.component';

describe('SingleSavedMemeComponent', () => {
  let component: SingleSavedMemeComponent;
  let fixture: ComponentFixture<SingleSavedMemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleSavedMemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleSavedMemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
