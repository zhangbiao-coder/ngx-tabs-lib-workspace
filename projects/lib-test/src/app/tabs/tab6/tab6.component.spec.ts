import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab6Component } from './tab6.component';

describe('Tab6Component', () => {
  let component: Tab6Component;
  let fixture: ComponentFixture<Tab6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tab6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
