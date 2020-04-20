import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { TextService } from './text-service/text.service';
import { FooterComponent } from './footer/footer.component';
import { FormaterService } from './text-service/formater.service';
import { SuggesterComponent } from './suggester/suggester.component';
import { SuggesterService } from './text-service/suggester.service';

@NgModule({
  declarations: [
    AppComponent,
    FileComponent,
    ControlPanelComponent,
    HeaderComponent,
    FooterComponent,
    SuggesterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    TextService,
    FormaterService,
    SuggesterService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
