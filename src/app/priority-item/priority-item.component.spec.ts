import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityItemComponent } from './priority-item.component';

describe('PriorityItemComponent', () => {
  let component: PriorityItemComponent;
  let fixture: ComponentFixture<PriorityItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
