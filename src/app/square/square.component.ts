import { Component, Input } from "@angular/core";

@Component({
  selector: "app-square",
  template: `
      <button>{{value}}</button>
  `,
  styles: [
    `button {
      height:100%;
      width:100%;
      font-size:5rem;
      font-weight:bold;
    }`,
  ],
})
export class SquareComponent {
  @Input()
  value: "X" | "O" = "X";
}
