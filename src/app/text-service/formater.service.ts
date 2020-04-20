import { Injectable } from '@angular/core';
import { TextParts, Tag, Selection } from './ model/text.model';

@Injectable()
export class FormaterService {

  private static readonly hmtlTagsByModifierType = {
    bold: 'b',
    italic: 'i',
    inserted: 'ins'
  };

  private static get validTags() {
    return Object.values(FormaterService. hmtlTagsByModifierType)
  }

  constructor() { }

  // Logic Of Modifications

  private getModifications(text: string) {
    const stack = [];

    // Init Values
    const actualState = {
      tagOpenAt: undefined,
      isOpenTag: undefined,
      tagType: undefined,
    };

    text.split('').forEach((char: string, index: number) => {
      if (actualState.tagOpenAt == null && char === '<') {
        actualState.tagOpenAt = index;
        actualState.isOpenTag = true;
        actualState.tagType = '';

      } else if (actualState.tagOpenAt != null) {
        if (char === '/' && index === actualState.tagOpenAt + 1 ) {
          actualState.isOpenTag = false;

        } else if (char === '>') {
          if (FormaterService.validTags.indexOf(actualState.tagType) >= 0) {
            stack.push({...actualState});
          }

          // Reset Values
          actualState.tagOpenAt = undefined;
          actualState.isOpenTag = undefined;
          actualState.tagType = undefined;

        } else {
          actualState.tagType += char;

        }
      }
    });

    return stack;
  }

  private getMissingTagsOfTagsStack(stackOfTags: Array<Tag>) {
    const actualState = {
      before: [],
      after: [],
    };

    stackOfTags.forEach((tag) => {
      if (tag.isOpenTag) {
        actualState.after.unshift({tagType: tag.tagType, isOpenTag: false});

      } else if (actualState.after.slice(0, 1).length === 1 &&
                 actualState.after.slice(0, 1)[0].tagType === tag.tagType) {
        actualState.after.shift();

      } else {
        actualState.before.unshift({tagType: tag.tagType, isOpenTag: true})
      }
    });

    return actualState;
  }

  private getHtmlOfTag(tag: Tag): string {
    return '<' + (tag.isOpenTag ? '' : '/') + tag.tagType + '>';
  }

  private applyMissingTagsToText(
      text: string,
      missingTags: { before: Array<Tag>, after: Array<Tag> }): string {
    return missingTags.before.map(this.getHtmlOfTag).join('') + text +
      missingTags.after.map(this.getHtmlOfTag).join('');
  }

  private areStacksBalanced(beforeStack, afterStack) {
    if (beforeStack.after.length !== afterStack.before.length) {
      return false;
    }

    afterStack.before.reverse().forEach((tag: Tag, index: number) => {
      if (beforeStack.after[index].tagType !== tag.tagType) {
        return false;
      }
    });

    return true;
 }

  private balanceTagsOfText(beforeText: string, afterText: string) {
    const beforeStack = this.getMissingTagsOfTagsStack(this.getModifications(beforeText));
    const afterStack = this.getMissingTagsOfTagsStack(this.getModifications(afterText));

    const alreadyBalanced = this.areStacksBalanced(beforeStack, afterStack);

    return {
      before: alreadyBalanced ? beforeText : this.applyMissingTagsToText(beforeText, beforeStack),
      after: alreadyBalanced ? afterText : this.applyMissingTagsToText(afterText, afterStack),
      openTags: alreadyBalanced ? beforeStack.after : []
    };
  }

  calculateModification(
      textParts: TextParts,
      selection: Selection,
      modification: { type: 'bold'|'italic'|'inserted'}): string {

    const htmlTag = FormaterService.hmtlTagsByModifierType[modification.type];

    if (htmlTag == null) {
      throw new Error('Invalid modification type');
      alert('error, see console');
    }

    const sideText = this.balanceTagsOfText(textParts.before, textParts.after);

    textParts.selected = this.applyMissingTagsToText(
        textParts.selected,
        this.getMissingTagsOfTagsStack(
            this.getModifications(textParts.selected)));

    if (this.getModifications(textParts.selected).some(tag => tag.tagType === htmlTag)) {
      textParts.selected = textParts.selected
        .split(this.getHtmlOfTag({ tagType: htmlTag, isOpenTag: true })).join('')
        .split(this.getHtmlOfTag({ tagType: htmlTag, isOpenTag: false })).join('');
    } else if (sideText.openTags.some(tag => tag.tagType === htmlTag)) {
      textParts.selected =
          this.getHtmlOfTag({ tagType: htmlTag, isOpenTag: false }) +
          textParts.selected +
          this.getHtmlOfTag({ tagType: htmlTag, isOpenTag: true });
    } else {
      textParts.selected =
          this.getHtmlOfTag({ tagType: htmlTag, isOpenTag: true }) +
          textParts.selected +
          this.getHtmlOfTag({ tagType: htmlTag, isOpenTag: false });
    }

    return sideText.before + textParts.selected + sideText.after;
  }
}
