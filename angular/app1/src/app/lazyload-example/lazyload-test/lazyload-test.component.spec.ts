import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyloadTestComponent } from './lazyload-test.component';

describe('LazyloadTestComponent', () => {
  let component: LazyloadTestComponent;
  let fixture: ComponentFixture<LazyloadTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyloadTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyloadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
