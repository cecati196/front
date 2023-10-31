import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  isActivateSearch = false;
  ngOnInit(): void {
    this.phrase.valueChanges.subscribe( value =>{
      if (value !== '') {
        this.isActivateSearch = true;
        this.inputChange.emit(value);
      } else {
        this.isActivateSearch = false;
        this.inputClean.emit(false);
      }
    })
  }
  phrase = new FormControl();
  @Output() inputChange = new EventEmitter<string>();
  @Output() inputClean = new EventEmitter<boolean>();
}
