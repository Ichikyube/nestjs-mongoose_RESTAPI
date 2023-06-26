import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Request, response } from 'express';
@Injectable()
export class BooksService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async addBook(createBookDto: CreateBookDto) {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = createBookDto;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;
    try {
      const book = new this.bookModel({
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      });
      const insertedBook = await book.save();
      response.json({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: insertedBook,
        code: 201,
      });
    } catch (error) {
      response.json({
        status: 'fail',
        message: error.message + 'Buku gagal ditambahkan',
        code: 500,
      });
    }

    return response;
  }
  async getAllBooks(request: Request): Promise<Book[]> {
    const query = request.query;
    switch (Object.keys(request.query)[0]) {
      case 'reading':
        return this.bookModel
          .find({ reading: query.reading })
          .select('id name publisher');
      case 'finished':
        return this.bookModel
          .find({ finished: query.finished })
          .select('id name publisher');
      case 'name':
        return this.bookModel
          .find({
            name: {
              $regex: query.name,
              $options: 'i', // Case-insensitive search
            },
          })
          .select('id name publisher');
      default:
        return this.bookModel.find().select('id name publisher');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
