export class CreateBookDto {
  readonly name: string;
  readonly year: number;
  readonly author: string;
  readonly summary: string;
  readonly publisher: string;
  readonly pageCount: number;
  readonly readPage: number;
  readonly reading: boolean;
}
