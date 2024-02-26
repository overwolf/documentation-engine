import ContentHandler from './content-handler';

export default abstract class ContentHandlerRunning<
  Content = string,
> extends ContentHandler<Content> {
  public splice(
    start: number,
    count: number,
    indexToLast: boolean,
    ...newContent: Content[]
  ) {
    this._currentPosition = start + newContent.length + (indexToLast ? -1 : 0);
    return this.content.splice(start, count, ...newContent);
  }
}
