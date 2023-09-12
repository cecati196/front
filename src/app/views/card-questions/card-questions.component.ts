import { Component } from '@angular/core';

import { Question } from 'src/app/shared/interfaces/question.interface';

import { CONSTANTS } from '../../shared/constants';

@Component({
  selector: 'app-card-questions',
  templateUrl: './card-questions.component.html',
  styleUrls: ['./card-questions.component.css']
})
export class CardQuestionsComponent {
  questions:Question[] = CONSTANTS.questions;

  showQuestion: { [key:number]:boolean } = {};

  toogleQuestion(index: number): void {
    this.showQuestion[index] = !this.showQuestion[index]
  }

}
