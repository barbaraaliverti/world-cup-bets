import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import fetch from 'node-fetch';
import { authenticate } from '../plugins/authenticate';

export async function authRoutes(fastify: FastifyInstance) {
  // Check logged in user by verifying if they have a token
  fastify.get('/me', {
    onRequest: [authenticate],
  }, async (request) => {
    return { user: request.user }
  } )

  fastify.post('/users', async (request) => {
    // Using Zod to validade the token 
    const createUserBody = z.object({
      access_token: z.string(),
    })

    const { access_token } = createUserBody.parse(request.body);

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    })

    const userData = await userResponse.json();

    // Using Zod to validate response
    const userInfoSchema = z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      picture: z.string().url(),
    })

    const userInfo = userInfoSchema.parse(userData);

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      }
    });

    if(!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        }
      })
    }

    // create JWT token
    const token = fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl,
    }, {
      sub: user.id,
      expiresIn: '7 days',
    })

    return { token }
  })
}