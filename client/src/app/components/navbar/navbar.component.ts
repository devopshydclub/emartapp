import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  isLoading: boolean = true;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoading = false;
  }

  logout() {
    this.authService.logoutUser();
    this.authService.userDetails(null);
    this.router.navigate["/"];
  }
}
