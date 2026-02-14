import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const ownership = (entity: string) => async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const entityId = req.params.id;

  const record = await prisma[entity].findUnique({ where: { id: entityId } });

  if (!record || record.userId !== userId) {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not own this resource' } });
  }

  next();
};