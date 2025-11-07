import { Request, Response } from 'express';
import { prisma } from '../app';
import { sendResponse } from '../utils/response';

// CREATE TRANSACTION
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { user_id, items } = req.body;

    if (!user_id || !items || !Array.isArray(items)) {
      return sendResponse(res, 400, false, 'User ID and items array are required');
    }

    // Check user exists
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) return sendResponse(res, 404, false, 'User not found');

    let totalQuantity = 0;
    let totalPrice = 0;

    // Validate items and calculate totals
    for (const item of items) {
      const book = await prisma.books.findFirst({ 
        where: { id: item.book_id, deleted_at: null } 
      });
      if (!book) return sendResponse(res, 404, false, `Book ${item.book_id} not found`);
      if (book.stock_quantity < item.quantity) {
        return sendResponse(res, 400, false, `Insufficient stock for ${book.title}`);
      }
      
      totalQuantity += item.quantity;
      totalPrice += book.price * item.quantity;
    }

    // Create transaction
    const order = await prisma.orders.create({ data: { user_id } });

    // Create order items and update stock
    for (const item of items) {
      await prisma.order_items.create({
        data: {
          order_id: order.id,
          book_id: item.book_id,
          quantity: item.quantity
        }
      });

      await prisma.books.update({
        where: { id: item.book_id },
        data: { stock_quantity: { decrement: item.quantity } }
      });
    }

    sendResponse(res, 201, true, 'Transaction created successfully', {
      transaction_id: order.id,
      total_quantity: totalQuantity,
      total_price: totalPrice
    });

  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// GET ALL TRANSACTIONS
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        order_items: {
          include: { book: true }
        }
      }
    });

    const transactions = orders.map(order => {
      const total_quantity = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
      const total_price = order.order_items.reduce((sum, item) => sum + (item.quantity * item.book.price), 0);

      return {
        id: order.id,
        total_quantity,
        total_price
      };
    });

    sendResponse(res, 200, true, 'Get all transaction successfully', transactions);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// GET TRANSACTION BY ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            book: {
              select: { id: true, title: true, price: true }
            }
          }
        }
      }
    });

    if (!order) return sendResponse(res, 404, false, 'Transaction not found');

    const items = order.order_items.map(item => ({
      book_id: item.book.id,
      book_title: item.book.title,
      quantity: item.quantity,
      subtotal_price: item.quantity * item.book.price
    }));

    const total_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const total_price = items.reduce((sum, item) => sum + item.subtotal_price, 0);

    sendResponse(res, 200, true, 'Get transaction detail successfully', {
      id: order.id,
      items,
      total_quantity,
      total_price
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};

// GET TRANSACTION STATISTICS
export const getTransactionStatistics = async (req: Request, res: Response) => {
  try {
    // Get all orders dengan items
    const orders = await prisma.orders.findMany({
      include: {
        order_items: {
          include: {
            book: true
          }
        }
      }
    });

    // Hitung total amount
    let totalAmount = 0;
    orders.forEach(order => {
      const orderTotal = order.order_items.reduce((sum, item) => {
        return sum + (item.quantity * item.book.price);
      }, 0);
      totalAmount += orderTotal;
    });

    const totalTransactions = orders.length;
    const averageTransactionAmount = totalTransactions > 0 
      ? Math.round(totalAmount / totalTransactions) 
      : 0;

    // Hitung genre statistics
    const genreStats = await prisma.genres.findMany({
      where: { deleted_at: null },
      include: {
        books: {
          include: {
            order_items: true
          }
        }
      }
    });

    const genreSales = genreStats.map(genre => {
      const totalSales = genre.books.reduce((sum, book) => {
        return sum + book.order_items.reduce((bookSum, item) => bookSum + item.quantity, 0);
      }, 0);
      return { name: genre.name, totalSales };
    });

    genreSales.sort((a, b) => b.totalSales - a.totalSales);

    const mostBookSalesGenre = genreSales[0]?.name || 'No data';
    const fewestBookSalesGenre = genreSales[genreSales.length - 1]?.name || 'No data';

    sendResponse(res, 200, true, 'Get transactions statistics successfully', {
      total_transactions: totalTransactions,
      average_transaction_amount: averageTransactionAmount,
      most_book_sales_genre: mostBookSalesGenre,
      fewest_book_sales_genre: fewestBookSalesGenre
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};