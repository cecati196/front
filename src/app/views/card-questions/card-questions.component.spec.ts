import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardQuestionsComponent } from './card-questions.component';

describe('CardQuestionsComponent', () => {
  let component: CardQuestionsComponent;
  let fixture: ComponentFixture<CardQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Generated by CodiumAI

describe('toogleQuestion', () => {

  // Tests that toggling a question that is currently hidden shows it
  it('should show question when it is currently hidden', () => {
    const component = new CardQuestionsComponent();
    component.showQuestion = { 0: false };
    component.toogleQuestion(0);
    expect(component.showQuestion[0]).toBe(true);
  });

  // Tests that toggling a question that is currently shown hides it
  it('should hide question when it is currently shown', () => {
    const component = new CardQuestionsComponent();
    component.showQuestion = { 0: true };
    component.toogleQuestion(0);
    expect(component.showQuestion[0]).toBe(false);
  });

  // Tests that toggling a question with an index that is out of bounds throws an error
  it('should throw an error when toggling a question with an out of bounds index', () => {
    const component = new CardQuestionsComponent();
    component.showQuestion = { 0: true };
    expect(() => {
      component.toogleQuestion(1);
    }).toThrowError();
  });

  // Tests that toggling a question that has not been initialized initializes it to hidden
  it('should initialize question to hidden when toggling a question that has not been initialized', () => {
    const component = new CardQuestionsComponent();
    component.showQuestion = {};
    component.toogleQuestion(0);
    expect(component.showQuestion[0]).toBe(false);
  });

  // Tests that toggling a question multiple times alternates between showing and hiding it
  it('should alternate between showing and hiding the question when toggling it multiple times', () => {
    const component = new CardQuestionsComponent();
    component.showQuestion = { 0: true };
    component.toogleQuestion(0);
    expect(component.showQuestion[0]).toBe(false);
    component.toogleQuestion(0);
    expect(component.showQuestion[0]).toBe(true);
  });
});

});
