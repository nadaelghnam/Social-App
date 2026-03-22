import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { MyTranslateComponent } from "../../features/myTranslate/my-translate/my-translate.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, MyTranslateComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {

}
