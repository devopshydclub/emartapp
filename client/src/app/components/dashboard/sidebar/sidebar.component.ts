import { Component, Input, OnInit } from "@angular/core";
// Models
import { User } from "src/app/models/User";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  @Input() user: User;
  isLoading: boolean = true;

  constructor() {}

  ngOnInit() {
    this.isLoading = false;
  }
}
