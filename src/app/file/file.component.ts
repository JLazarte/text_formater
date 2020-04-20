import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TextService } from '../text-service/text.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FileComponent implements OnInit {
  myText: string;
  text$: Promise<string>;

  constructor(private textService: TextService) {
  }

  ngOnInit() {
    this.textService.subscribeTextChanges((text) => this.myText = text);
  }

  private onChange() {
    this.textService.updateText(this.myText);
  }

  private onClick($event) {
    const selection = {
      start: $event.target.selectionStart,
      end: $event.target.selectionEnd,
    };

    this.textService.updateSelection(selection);
  }
}
