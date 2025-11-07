import { Request, Response } from 'express';
import { prisma } from '../app';
import { sendResponse } from '../utils/response';

// CREATE BOOK
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, writer, publisher, publication_year, description, price, stock_quantity, genre_id } = req.body;

    // Validasi required fields
    if (!title || !writer || !publisher || !publication_year || !price || !stock_quantity || !genre_id) {
      return sendResponse(res, 400, false, 'All fields are required except description');
    }

    // Cek duplikat title
    const existingBook = await prisma.books.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } }
    });

    if (existingBook) {
      return sendResponse(res, 400, false, 'Book title already exists');
    }

    // Cek genre exists
    const genre = await prisma.genres.findFirst({
      where: { id: genre_id, deleted_at: null }
    });

    if (!genre) {
      return sendResponse(res, 400, false, 'Genre not found');
    }

    const book = await prisma.books.create({
      data: {
        title, writer, publisher, publication_year, description, price, stock_quantity, genre_id
      }
    });

    sendResponse(res, 201, true, 'Book added successfully', {
      id: book.id,
      title: book.title,
      created_at: book.created_at
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// GET ALL BOOKS
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', orderByTitle = 'asc', orderByPublishDate = 'asc' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where condition
    const where: any = {
      deleted_at: null
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { writer: { contains: search as string, mode: 'insensitive' } },
        { publisher: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get books dengan genre name
    const books = await prisma.books.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: [
        { title: orderByTitle as 'asc' | 'desc' },
        { publication_year: orderByPublishDate as 'asc' | 'desc' }
      ],
      include: {
        genre: {
          select: { name: true }
        }
      }
    });

    // Format response
    const formattedBooks = books.map((book: any) => ({
      id: book.id,
      title: book.title,
      writer: book.writer,
      publisher: book.publisher,
      description: book.description,
      publication_year: book.publication_year,
      price: book.price,
      stock_quantity: book.stock_quantity,
      genre: book.genre.name
    }));

    // Pagination
    const total = await prisma.books.count({ where });
    const meta = {
      page: pageNum,
      limit: limitNum,
      prev_page: pageNum > 1 ? pageNum - 1 : null,
      next_page: pageNum * limitNum < total ? pageNum + 1 : null
    };

    sendResponse(res, 200, true, 'Get all book successfully', formattedBooks, meta);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// GET BOOK BY ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await prisma.books.findFirst({
      where: { 
        id,
        deleted_at: null 
      },
      include: {
        genre: {
          select: { name: true }
        }
      }
    });

    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    const formattedBook = {
      id: book.id,
      title: book.title,
      writer: book.writer,
      publisher: book.publisher,
      description: book.description,
      publication_year: book.publication_year,
      price: book.price,
      stock_quantity: book.stock_quantity,
      genre: book.genre.name
    };

    sendResponse(res, 200, true, 'Get book detail successfully', formattedBook);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// GET BOOKS BY GENRE
export const getBooksByGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search = '', orderByTitle = 'asc', orderByPublishDate = 'asc' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Cek genre exists
    const genre = await prisma.genres.findFirst({
      where: { id, deleted_at: null }
    });

    if (!genre) {
      return sendResponse(res, 404, false, 'Genre not found');
    }

    // Build where condition
    const where: any = {
      genre_id: id,
      deleted_at: null
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { writer: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const books = await prisma.books.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: [
        { title: orderByTitle as 'asc' | 'desc' },
        { publication_year: orderByPublishDate as 'asc' | 'desc' }
      ],
      include: {
        genre: {
          select: { name: true }
        }
      }
    });

    const formattedBooks = books.map((book: any) => ({
      id: book.id,
      title: book.title,
      writer: book.writer,
      publisher: book.publisher,
      description: book.description,
      publication_year: book.publication_year,
      price: book.price,
      stock_quantity: book.stock_quantity,
      genre: book.genre.name
    }));

    const total = await prisma.books.count({ where });
    const meta = {
      page: pageNum,
      limit: limitNum,
      prev_page: pageNum > 1 ? pageNum - 1 : null,
      next_page: pageNum * limitNum < total ? pageNum + 1 : null
    };

    sendResponse(res, 200, true, 'Get all book by genre successfully', formattedBooks, meta);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// UPDATE BOOK
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description, price, stock_quantity } = req.body;

    // Cek book exists
    const book = await prisma.books.findFirst({
      where: { 
        id,
        deleted_at: null 
      }
    });

    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    // Update hanya field yang diizinkan
    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;

    const updatedBook = await prisma.books.update({
      where: { id },
      data: updateData
    });

    sendResponse(res, 200, true, 'Book updated successfully', {
      id: updatedBook.id,
      title: updatedBook.title,
      updated_at: updatedBook.updated_at
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// DELETE BOOK
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await prisma.books.findFirst({
      where: { 
        id,
        deleted_at: null 
      }
    });

    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    // Soft delete
    await prisma.books.update({
      where: { id },
      data: { deleted_at: new Date() }
    });

    sendResponse(res, 200, true, 'Book removed successfully');
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};