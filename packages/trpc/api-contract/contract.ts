import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

/* 
  These schemas should be moved from here probably.
  It grows quickly.
*/
const GetDocumentsQuerySchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});

const DocumentSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  status: z.string(),
  documentDataId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().nullable(),
});

const SuccessfulResponseSchema = z.object({
  documents: DocumentSchema.array(),
  totalPages: z.number(),
});

const UnsuccessfulResponseSchema = z.object({
  message: z.string(),
});

export const contract = c.router(
  {
    getDocuments: {
      method: 'GET',
      path: '/documents',
      query: GetDocumentsQuerySchema,
      responses: {
        200: SuccessfulResponseSchema,
      },
      summary: 'Get all documents',
    },
    getDocument: {
      method: 'GET',
      path: `/documents/:id`,
      responses: {
        200: DocumentSchema,
      },
      summary: 'Get a single document',
    },
    deleteDocument: {
      method: 'DELETE',
      path: `/documents/:id`,
      body: z.string(),
      responses: {
        200: DocumentSchema,
        404: UnsuccessfulResponseSchema,
      },
      summary: 'Delete a document',
    },
  },
  {
    baseHeaders: z.object({
      authorization: z.string(),
    }),
  },
);