import ContentHandlerRunning from '../../utils/content-handler-running';
import { EscapedSequence, EscapedSyntax } from './sequence';

export default class ContentHandlerEscaped<
  Syntax = EscapedSyntax,
> extends ContentHandlerRunning<EscapedSequence<Syntax, any>> {
  public contentAsString(content: EscapedSequence<Syntax, any>): string {
    return content.content;
  }

  public getEscapedContent() {
    return this.content;
  }

  /**
   * Since many of the methods that iterate over the content always get the next
   * value, this method can 'unshift' the iterator ahead of time to prevent
   * weird index issues
   *
   * @returns {number} The pre-shifted index
   */
  public unshiftIndex(): number {
    return this._currentPosition--;
  }
}
