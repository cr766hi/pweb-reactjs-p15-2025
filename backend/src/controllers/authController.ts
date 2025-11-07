import { Request, Response } from 'express';
import { prisma } from '../app';
import { sendResponse } from '../utils/response';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password) {
      sendResponse(res, 400, false, 'Email and password are required');
      return;
    }

    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      sendResponse(res, 400, false, 'User already exists');
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        created_at: true
      }
    });

    sendResponse(res, 201, true, 'User registered successfully', user);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendResponse(res, 400, false, 'Email and password are required');
      return;
    }

    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      sendResponse(res, 401, false, 'Invalid credentials');
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      sendResponse(res, 401, false, 'Invalid credentials');
      return;
    }

    const token = generateToken(user.id);

    sendResponse(res, 200, true, 'Login successfully', {
      access_token: token
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    if (!user) {
      sendResponse(res, 404, false, 'User not found');
      return;
    }

    sendResponse(res, 200, true, 'Get me successfully', user);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};