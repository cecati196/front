import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  closeNav(){
    const menu = document.querySelector('#toggle') as HTMLInputElement;
    menu.checked = false;
  }

}
