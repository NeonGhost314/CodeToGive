import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomplishmentsComponent } from './accomplishments.component';

describe('AccomplishmentsComponent', () => {
  let component: AccomplishmentsComponent;
  let fixture: ComponentFixture<AccomplishmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccomplishmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccomplishmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
