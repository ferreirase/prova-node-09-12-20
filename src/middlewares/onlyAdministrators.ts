/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import AppError from '../errors/AppError';

export default async function onlyAdministrators(
  request: Request,
  _: Response,
  next: NextFunction,
): Promise<any> {
  const actionUser = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :id', { id: request.user.id })
    .getOne();

  if (!actionUser || !actionUser.isAdmin) {
    throw new AppError({
      message: 'Only administrators',
      statusCode: 400,
    });
  }

  return next();
}
