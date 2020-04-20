import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggesterComponent } from './suggester.component';

describe('SuggesterComponent', () => {
  let component: SuggesterComponent;
  let fixture: ComponentFixture<SuggesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
