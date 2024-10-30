import { embedText } from '@primasense/embeddings-js';
import { RequestHandler } from 'express';
import { Output, array, merge, minLength, number, object, parse, string } from 'valibot';
import { embeddings } from '../../../services/embeddings.js';
import { db } from '../../../database/client.js';
import { Frame } from '../../../database/schema/index.js';
import { and, notExists, sql } from 'drizzle-orm';
import { APIError } from '../../../middleware/error.js';
import { SearchRouterQuerySchema, collectionIdQueryParam } from '../schema.js';

export const SearchByTextQuerySchema = merge([SearchRouterQuerySchema, object({ text: string([minLength(3)]) })]);
export const SearchByTextResponseItemSchema = object({ description: string(), videoId: number(), secondsFromStart: number() });
export const SearchByTextResponseSchema = array(SearchByTextResponseItemSchema);

export type SearchByTextQuery = Output<typeof SearchByTextQuerySchema>;
export type SearchByTextResponse = Output<typeof SearchByTextResponseSchema>;

export const searchByText: RequestHandler<{}, SearchByTextResponse, {}, SearchByTextQuery> = async (req, res, next) => {
  try {
    const { [collectionIdQueryParam]: collectionId, text } = parse(SearchByTextQuerySchema, req.query);

    if (!req.auth.permissions.find((permission) => permission.collection === collectionId)) throw new APIError('permission-denied', 'Permission denied.');

    const embedding = await embedText(embeddings, text);

    const frames = await db
      .select()
      .from(Frame)
      .where(
        and(
          // TODO: frame belongs to video inside one of the specified collections
          notExists(sql`
          SELECT 1 FROM ${Frame} as f
          WHERE ABS(f.seconds_from_start - ${Frame.secondsFromStart}) <= ${20}
          AND (f.embedding <-> ARRAY[${sql.raw(embedding.toString())}]) < (${Frame.embedding} <-> ARRAY[${sql.raw(embedding.toString())}])
          AND f.video_id = ${Frame.videoId}`),
        ),
      )
      .orderBy(sql`${Frame.embedding} <-> ARRAY[${sql.raw(embedding.toString())}]`)
      .limit(3);

    const response = parse(
      SearchByTextResponseSchema,
      frames.map(({ description, videoId, secondsFromStart }) => ({ description, videoId, secondsFromStart })),
    );

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
