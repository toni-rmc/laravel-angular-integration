import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivationsComponent } from './motivations.component';

describe('MotivationsComponent', () => {
  let component: MotivationsComponent;
  let fixture: ComponentFixture<MotivationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
