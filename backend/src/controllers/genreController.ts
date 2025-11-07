import { Request, Response } from 'express';
import { prisma } from '../app';
import { sendResponse } from '../utils/response';

// CREATE GENRE
export const createGenre = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return sendResponse(res, 400, false, 'Genre name is required');
    }

    // Cek duplikat
    const existingGenre = await prisma.genres.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existingGenre) {
      return sendResponse(res, 400, false, 'Genre already exists');
    }

    const genre = await prisma.genres.create({
      data: { name }
    });

    sendResponse(res, 201, true, 'Genre created successfully', {
      id: genre.id,
      name: genre.name,
      created_at: genre.created_at
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// GET ALL GENRES (WITH PAGINATION & FILTER)
export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', orderByName = 'asc' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where condition
    const where: any = {
      deleted_at: null // Soft delete filter
    };

    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive'
      };
    }

    // Get genres
    const genres = await prisma.genres.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        name: orderByName as 'asc' | 'desc'
      },
      select: {
        id: true,
        name: true
      }
    });

    // Get total count for pagination
    const total = await prisma.genres.count({ where });

    const meta = {
      page: pageNum,
      limit: limitNum,
      prev_page: pageNum > 1 ? pageNum - 1 : null,
      next_page: pageNum * limitNum < total ? pageNum + 1 : null
    };

    sendResponse(res, 200, true, 'Get all genre successfully', genres, meta);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// GET GENRE BY ID
export const getGenreById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const genre = await prisma.genres.findFirst({
      where: { 
        id,
        deleted_at: null 
      },
      select: {
        id: true,
        name: true
      }
    });

    if (!genre) {
      return sendResponse(res, 404, false, 'Genre not found');
    }

    sendResponse(res, 200, true, 'Get genre detail successfully', genre);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// UPDATE GENRE
export const updateGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return sendResponse(res, 400, false, 'Genre name is required');
    }

    // Cek jika genre exists
    const existingGenre = await prisma.genres.findFirst({
      where: { 
        id,
        deleted_at: null 
      }
    });

    if (!existingGenre) {
      return sendResponse(res, 404, false, 'Genre not found');
    }

    // Cek duplikat name
    const duplicateGenre = await prisma.genres.findFirst({
      where: { 
        name: { equals: name, mode: 'insensitive' },
        id: { not: id },
        deleted_at: null
      }
    });

    if (duplicateGenre) {
      return sendResponse(res, 400, false, 'Genre name already exists');
    }

    const updatedGenre = await prisma.genres.update({
      where: { id },
      data: { name }
    });

    sendResponse(res, 200, true, 'Genre updated successfully', {
      id: updatedGenre.id,
      name: updatedGenre.name,
      updated_at: updatedGenre.updated_at
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// DELETE GENRE (SOFT DELETE)
export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek jika genre exists
    const genre = await prisma.genres.findFirst({
      where: { 
        id,
        deleted_at: null 
      }
    });

    if (!genre) {
      return sendResponse(res, 404, false, 'Genre not found');
    }

    // Soft delete
    await prisma.genres.update({
      where: { id },
      data: { deleted_at: new Date() }
    });

    sendResponse(res, 200, true, 'Genre removed successfully');
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};