import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TextService } from '../text-service/text.service';
import { Suggestion } from '../text-service/ model/text.model';

@Component({
  selector: 'app-suggester',
  templateUrl: './suggester.component.html',
  styleUrls: ['./suggester.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SuggesterComponent implements OnInit {
  mySuggestion: Suggestion;
  msgStatus: 'Select' | 'Change' | 'Results';

  constructor(private textService: TextService) {
    this.mySuggestion = { word: null,  options: [] };
  }

  ngOnInit() {
    this.textService.subscribeSuggestion((suggestion: Suggestion) => {
      this.mySuggestion = suggestion;

      const validSuggestion = this.mySuggestion.options != null && this.mySuggestion.options.length !== 0;

      if (this.mySuggestion.word != null && !validSuggestion) {
        this.msgStatus = 'Change';

      } else if (validSuggestion) {
        this.msgStatus = 'Results';

      } else {
        this.msgStatus = 'Select';
      }
    });
  }

  onSelection(suggestion: string) {
    this.textService.applySuggestion(suggestion);
  }
}
