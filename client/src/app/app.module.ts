import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { AngularFontAwesomeModule } from "angular-font-awesome";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppRoutingModule, routingComponents } from "./app-routing.module";
// Services
import { AuthService } from "./services/auth.service";
import { TokenInterceptorService } from "./services/token-interceptor.service";
// Guards
import { AuthGuard } from "./guards/auth.guard";
// Components
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/dashboard/sidebar/sidebar.component";
import { NotificationPanelComponent } from "./components/main/notification-panel/notification-panel.component";
import { ProductsComponent } from "./components/dashboard/products/products.component";
import { CartComponent } from "./components/dashboard/sidebar/cart/cart.component";
import { AdminFormComponent } from "./components/dashboard/sidebar/admin-form/admin-form.component";
import { OrderFormComponent } from "./components/dashboard/sidebar/cart/order-form/order-form.component";
// Pipes
import { FilterPipe } from "./pipes/filter.pipe";
import { HighlightPipe } from "./pipes/highlight.pipe";
import { ShortenPipe } from "./pipes/shorten.pipe";
import { FooterComponent } from './components/footer/footer.component';
import { BookComponent } from './components/main/book/book.component';
import { Axios } from "axios";
import { BookService } from "./services/book.service";
import { ProductService } from "./services/product.service";
import { OrderService } from "./services/order.service";
import { AxiosHttpService } from "./services/axios-http.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    routingComponents,
    NotificationPanelComponent,
    ProductsComponent,
    CartComponent,
    OrderFormComponent,
    AdminFormComponent,
    FilterPipe,
    HighlightPipe,
    ShortenPipe,
    FooterComponent,
    BookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // AngularFontAwesomeModule
    FontAwesomeModule
    
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    BookService,
    ProductService,
    OrderService,
    AxiosHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
