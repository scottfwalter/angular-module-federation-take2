import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefComponent } from './def.component';

describe('DefComponent', () => {
  let component: DefComponent;
  let fixture: ComponentFixture<DefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
