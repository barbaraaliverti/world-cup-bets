import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';
import { authenticate } from '../plugins/authenticate'
import { userRoutes } from './user';

export async function poolRoutes(fastify: FastifyInstance) {

  // Count pools
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()
    return { count }
  });

  // Create new betting pool
  fastify.post('/pools', async ( request, reply ) => {
    // Use Zod to validate title (not null, type string)
    const createPoolBody = z.object({
      title: z.string(),
    });
    const { title } = createPoolBody.parse(request.body);

    const generate = new ShortUniqueId({ length: 6});
    const code = String(generate()).toUpperCase();

    try {
      // check if user is signed in
      await request.jwtVerify();

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub,
            }
          }
        }
      })

    } catch {
      // create a pool without signing in
      await prisma.pool.create({
        data: {
          title,
          code
        }
      });
    }

    return reply.status(201).send({ code })
  })

  // Join a pool
  fastify.post('/pools/join', {
    onRequest: [authenticate]
  }, async (request, reply) => {

    // Validate pool code type
    const joinPoolBody = z.object({
      code: z.string(),
    })

    const { code } = joinPoolBody.parse(request.body);

    // check if pool exists
    const pool = await prisma.pool.findUnique({
      where: {
        code,
      },
      include: {
        participants: {
          where: {
            userId: request.user.sub,
          }
        }
      }
    });

    // Search pool
    if (!pool) {
      return reply.status(400).send({
        message: 'Pool not found.'
      })
    }

    // Search if user has already joined
    if (pool.participants.length > 0) {
      return reply.status(400).send({
        message: 'You already joined this pool.'
      })
    }

    // Pool created on web (without owner) => first user to join becomes pool owner
    if(!pool.ownerId) {
      await prisma.pool.update({
        where: {
          id: pool.id,
        },
        data: {
          ownerId: request.user.sub,
        }
      })
    }

    // Create pool and add user as owner
    await prisma.participant.create({
      data: {
        poolId: pool.id,
        userId: request.user.sub,
      }
    })

    return reply.status(201).send();

  })

  // Get all pools joined by a user
  fastify.get('/pools', {
    onRequest: [authenticate]
  }, async (request) => {
    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub,
          }
        }
      }, 
      include: {
        // pool owner
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        // total participants
        _count: {
          select: {
            participants: true
          }
        },
        // Participants' avatars
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        }
      }
    })

    return { pools }
  })

  // Get pool's details

  fastify.get('/pools/:id', {
    onRequest: [authenticate],
  }, async (request)=> {
    const getPoolParams = z.object({
      id: z.string()
    })

    const { id } = getPoolParams.parse(request.params);

    const pool = await prisma.pool.findUnique({
      where: {
        id
      }, 
      include: {
        // pool owner
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        // total participants
        _count: {
          select: {
            participants: true
          }
        },
        // Participants' avatars
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        }
      }
    })

    return { pool }

  })
}