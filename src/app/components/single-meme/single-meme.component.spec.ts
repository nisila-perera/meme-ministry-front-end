import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMemeComponent } from './single-meme.component';

describe('SingleMemeComponent', () => {
  let component: SingleMemeComponent;
  let fixture: ComponentFixture<SingleMemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleMemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleMemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
