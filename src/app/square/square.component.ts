import { Component, Input } from "@angular/core";

@Component({
  selector: "app-square",
  template: `
     <!--  <button class="empty" *ngIf="value">{{value}}</button> -->
      <button class="ex" *ngIf="value == 'X'">{{value}}</button>
      <button class="oh" *ngIf="value == 'O'">{{value}}</button>
  `,
  styles: [
    `button {
      height:100%;
      width:100%;
      font-size:5rem;
      font-weight:bold;
    }`,
  ],
  styleUrls: ["./square.component.scss"],
})
export class SquareComponent {
  @Input()
  value: "X" | "O" = "X";
}
