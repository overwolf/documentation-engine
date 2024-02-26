import { flow, pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';

export default abstract class ContentHandler<Content = string> {
  constructor(protected content: Content[]) {}

  protected _currentPosition = 0;

  public currentIndex(): number {
    return this._currentPosition;
  }

  public _dangerousCurrent(): string {
    const result = this.content[this._currentPosition];
    return result ? this.contentAsString(result) : 'Out Of Bounds';
  }

  public current(): E.Either<string, Content> {
    return flow(
      // Create Option<number> if the current index has any associated content
      E.fromPredicate(
        (position: number) => position < this.content.length,
        () => 'Index out of bounds!',
      ),
      // If the condition passes, get the current content
      E.map((position: number) => this.content[position]),
      // Initiate with the current position
    )(this._currentPosition);
  }

  public peek(count: number): E.Either<string, Content[]> {
    return flow(
      // Create Option<number> if the lastIndex is valid
      E.fromPredicate(
        (index: number) => this.content.length >= index,
        () => 'Attempted to peek past array length!',
      ),
      // If the condition passes, get the content and convert it into an option
      E.map(
        (index: number) =>
          this.content.slice(this._currentPosition, index) as Content[],
      ),
      // Initiate with the right lastIndex
    )(this._currentPosition + count);
  }

  public consume(c: number): E.Either<string, Content[]> {
    return pipe(
      c,
      // Check if content exists
      (count) => this.peek(count),
      // If the content exists, move the currentPosition, and return the content
      E.map((content) => {
        this._currentPosition += c;
        return content;
      }),
      // Initiate with the amount of content to consume
    );
  }

  public consumeOne(): E.Either<string, Content> {
    return flow(
      () => this.consume(1),
      E.map((content) => content[0]),
    )();
  }

  public abstract contentAsString(content: Content): string;
}
