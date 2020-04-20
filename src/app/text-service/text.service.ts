import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Selection, Suggestion } from './ model/text.model';
import { FormaterService } from './formater.service';
import { SuggesterService } from './suggester.service';

@Injectable()
export class TextService {

  public myText: BehaviorSubject<string>;
  private selection: Selection;


  constructor(private formaterService: FormaterService,
              private suggestionService: SuggesterService) {
    this.myText = new BehaviorSubject('A year ago I was in the audience at a gathering of designers in San Francisco. ' +
    'There were four designers on stage, and two of them worked for me. I was there to support them. ' +
    'The topic of design responsibility came up, possibly brought up by one of my designers, I honestly don’t remember the details. ' +
    'What I do remember is that at some point in the discussion I raised my hand and suggested, to this group of designers, ' +
    'that modern design problems were very complex. And we ought to need a license to solve them.');
  }

  updateText(newText: string) {
    this.myText.next(newText);
  }

  subscribeTextChanges(callback: (text: string) => void) {
    this.myText.subscribe(callback);
  }

  subscribeSuggestion(callback: (suggestion: Suggestion) => void) {
    this.suggestionService.subscribeSuggestion(callback);
  }

  private getTextParts(text: string, selection: Selection ) {
    return {
      before: text.slice(0, selection.start),
      selected: text.slice(selection.start, selection.end),
      after: text.slice(selection.end),
    };
  }

  applyModification(modification: { type: 'bold'|'italic'|'inserted'}) {
    if (this.selection == null) {
      return;
    }

    this.myText.next(
        this.formaterService.calculateModification(
            this.getTextParts(this.myText.getValue(), this.selection),
            this.selection,
            modification));
  }

  applySuggestion(suggestion: String) {
    const textParts = this.getTextParts( this.myText.getValue(), this.selection);
    this.updateSelection(null);
    this.myText.next(textParts.before + suggestion + textParts.after);
  }

  private calculateSuggestion() {
    const selection = this.selection != null ?
      this.getTextParts(
        this.myText.getValue(),
        this.selection
      ).selected :
      null;

    this.suggestionService.calculateSuggestions(selection);
  }

  updateSelection(selection: Selection) {
    this.selection = selection;
    this.calculateSuggestion();
  }
}
