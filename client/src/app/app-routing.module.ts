import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./guards/auth.guard";

import { MainComponent } from "./components/main/main.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/main/auth/login/login.component";
import { RegisterComponent } from "./components/main/auth/register/register.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { BookComponent } from "./components/main/book/book.component";

const routes: Routes = [
  { path: "", redirectTo: "/", pathMatch: "full" },
  { path: "", component: MainComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "book", component: BookComponent },

  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const routingComponents = [
  MainComponent,
  DashboardComponent,
  LoginComponent,
  RegisterComponent,
  BookComponent,
  PageNotFoundComponent
];
