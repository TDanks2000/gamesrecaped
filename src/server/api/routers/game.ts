import { z } from "zod";

import { GameSelect } from "@/@types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const gameRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(1, "Title must be at least 1 character")
          .max(255, "Title must be less than 255 characters"),
        release_date: z.date().optional(),
        isExcusive: z.boolean(),
        isGameUpdate: z.boolean(),
        isDLC: z.boolean(),
        hasMP: z.boolean(),
        hasSP: z.boolean(),
        genres: z.array(z.string()).optional(),
        devloper: z.array(z.string()).optional(),
        publisher: z.array(z.string()).optional(),
        conferenceId: z.number(),
        media: z.object({
          type: z.string(),
          link: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.game.create({
        data: {
          title: input.title,
          release_date: input.release_date,
          genres: input.genres,
          isExcusive: input.isExcusive,
          isGameUpdate: input.isGameUpdate,
          isDLC: input.isDLC,
          hasMP: input.hasMP,
          hasSP: input.hasSP,
          devloper: input.devloper,
          publisher: input.publisher,
          media: {
            create: input.media,
          },
          conference_id: input.conferenceId,
        },
      });
    }),
  all: publicProcedure
    .input(
      z.object({
        select: z.array(z.nativeEnum(GameSelect).optional()).optional(),
        offset: z.number().optional(),
        limit: z.number().optional(),
        sort: z
          .enum(["date-asc", "date-desc", "newest", "oldest"])
          .default("newest"),
        conference_id: z
          .number()
          .or(z.enum(["all"]))
          .optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const select: {
        [key in GameSelect]?: true;
      } = {
        media: true,
      };

      if (input.select) {
        for (const item of input.select) {
          if (!item) continue;
          select[item] = true;
        }
      }

      const data = ctx.db.game.findMany({
        select: !Object.values(select).length ? undefined : select,
        skip: input.offset,
        take: input.limit,
        orderBy: {
          release_date:
            input.sort === "date-asc"
              ? "asc"
              : input.sort === "date-desc"
                ? "desc"
                : undefined,
          id:
            input.sort === "oldest"
              ? "asc"
              : input.sort === "newest"
                ? "desc"
                : undefined,
        },
        where: {
          conference_id: {
            equals:
              (input?.conference_id === "all"
                ? undefined
                : input?.conference_id) ?? undefined,
          },
        },
      });

      return data;
    }),
  count: publicProcedure.query(({ ctx }) => {
    return ctx.db.game.count();
  }),
  search: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const data = ctx.db.game.findMany({
        where: {
          title: {
            contains: input.title,
          },
        },
      });

      return data;
    }),
  latest: publicProcedure.query(async ({ ctx }) => {
    const games = await ctx.db.game.findMany({
      orderBy: {
        release_date: "desc",
      },
      take: 1,
      select: {
        media: true,
        title: true,
        release_date: true,
      },
    });

    if (games?.length) return games[0];
    return null;
  }),
  addMedia: publicProcedure
    .input(
      z.object({
        gameId: z.number(),
        media: z.object({
          type: z.string(),
          link: z.string(),
          isImage: z.boolean(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.game.update({
        where: {
          id: input.gameId,
        },
        data: {
          media: {
            create: input.media,
          },
        },
      });
    }),
  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
        select: z.array(z.nativeEnum(GameSelect).optional()).optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const select: {
        [key in GameSelect]?: true;
      } = {
        media: true,
      };

      if (input.select) {
        for (const item of input.select) {
          if (!item) continue;
          select[item] = true;
        }
      }

      return ctx.db.game.findUnique({
        select: !Object.values(select).length ? undefined : select,
        where: {
          id: input.id,
        },
      });
    }),
});
