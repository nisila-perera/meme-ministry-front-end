import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedMemesComponent } from './saved-memes.component';

describe('SavedMemesComponent', () => {
  let component: SavedMemesComponent;
  let fixture: ComponentFixture<SavedMemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedMemesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedMemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
