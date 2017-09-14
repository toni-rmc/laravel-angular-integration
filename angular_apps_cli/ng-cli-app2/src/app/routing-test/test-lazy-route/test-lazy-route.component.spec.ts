import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLazyRouteComponent } from './test-lazy-route.component';

describe('TestLazyRouteComponent', () => {
  let component: TestLazyRouteComponent;
  let fixture: ComponentFixture<TestLazyRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestLazyRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestLazyRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
