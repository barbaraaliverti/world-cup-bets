import { PrismaClient } from '@prisma/client';

//connect with db
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane_doe@email.com',
      avatarUrl: 'https://github.com/barbaraaliverti.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'First betting pool',
      code: 'BOL123',
      ownerId: user.id,

      // when a pool is created, create an entry at Participants table 
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-10T16:00:00.591Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-15T16:00:00.591Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }
        }
      }
    }
  })
}

main()