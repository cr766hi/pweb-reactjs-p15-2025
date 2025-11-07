import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    prev_page?: number | null;
    next_page?: number | null;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  meta?: ApiResponse['meta']
): void => {
  const response: ApiResponse<T> = {
    success,
    message,
    data,
    meta
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string
): void => {
  sendResponse(res, statusCode, false, message);
};