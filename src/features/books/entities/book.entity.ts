import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  publisher: string;

  @Prop({ required: true })
  pageCount: number;

  @Prop({ required: true })
  lastReadPage: number;

  @Prop({ required: true })
  finished: boolean;

  @Prop({ required: true })
  reading: boolean;

  @Prop({ default: Date.now })
  insertedAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
