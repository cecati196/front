import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() inputChange = new EventEmitter<string>();
  search(phrase:string){
    this.inputChange.emit(phrase);
  }

}
