import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSpecialitiesComponent } from './container-specialities.component';

describe('ContainerSpecialitiesComponent', () => {
  let component: ContainerSpecialitiesComponent;
  let fixture: ComponentFixture<ContainerSpecialitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerSpecialitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerSpecialitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
