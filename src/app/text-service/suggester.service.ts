import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Suggestion } from './ model/text.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class SuggesterService {
  private static readonly DATAMUSE_SERVICE = 'https://api.datamuse.com/words?rel_syn=';
  public mySuggestion: BehaviorSubject<Suggestion>;

  constructor(private http: HttpClient) {
    this.mySuggestion = new BehaviorSubject({ word: null, options: [] });
  }

  public subscribeSuggestion(callback: (suggestion: Suggestion) => void) {
    this.mySuggestion.subscribe(callback);
  }

  private getSuggestions(word: string): Observable<any> {
    return this.http.get(
        SuggesterService.DATAMUSE_SERVICE + word,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    )
  }

  public calculateSuggestions(sentence: string) {
    if (sentence == null || sentence.length === 0 || sentence.indexOf(' ') >= 0) {
      this.mySuggestion.next({ word: sentence, options: [] });
      return;
    }

    this.getSuggestions(sentence).subscribe((response) => {
      this.mySuggestion.next({ word: sentence, options: response.map(val => val.word) });
    }, (error) => {
      this.mySuggestion.next({ word: sentence, options: [] });
    });
  }
}
