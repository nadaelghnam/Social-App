import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { MyTranslateService } from './my-translate.service';

@Component({
  selector: 'app-my-translate',
  imports: [TranslatePipe],
  templateUrl: './my-translate.component.html',
  styleUrl: './my-translate.component.css',
})
export class MyTranslateComponent implements OnInit {

  translate = inject(TranslateService)
  myTranslate = inject(MyTranslateService)


  ngOnInit(): void {
    this.translate.addLangs(['ar', 'en']);
    this.translate.setFallbackLang('en');
    if (localStorage.getItem("lang")) {
      this.translate.use(localStorage.getItem("lang") as string);
      this.myTranslate.changeDir()

    }

  }

  changLang() {

    let currentLang = localStorage.getItem("lang")
    localStorage.setItem("lang", currentLang=="en"?"ar":"en")
   console.log(currentLang=="en"?"ar":"en");

    this.myTranslate.changeDir()
    if (localStorage.getItem("lang")) {
      this.translate.use(localStorage.getItem("lang") as string)
    }
  }

}
