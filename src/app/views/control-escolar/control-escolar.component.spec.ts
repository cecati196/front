import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEscolarComponent } from './control-escolar.component';

describe('ControlEscolarComponent', () => {
  let component: ControlEscolarComponent;
  let fixture: ComponentFixture<ControlEscolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlEscolarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlEscolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
