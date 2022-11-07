## Class 4 - Server
### Routes
- Create files for each route, remove them from server.ts

#### Auth route
- Create auth route to create or validate a new user
- How to validate if a user exists:
  - Using Google Id from response: create a new column in the User model; the GoogleId column can't be mandatory because there are users on the db already without this info, so it has to be optional (or reset db)
  - Generate a new migration
  ```
    npx prisma migrate dev
  ```
- After a user sign up/sign in, I need to keep track of them on all pages of the app => use JWT token (using @fastify/jwt)
  - on server.ts => add secret
  - on auth route => create token
  - validate token => create a plugin(same as middleware in express) for authentication

#### Pool routes
- Create new betting pool
- Join a pool
- Get all pools joined by a user
- Get pool's details

#### Game route
- get all games in a pool => user can only make one bet in each game, so the response returns the last bet or null if no bets were made

#### Guess/Bet routes

### Mobile
- Router
  - create and add types to routes
- Integrate API
  - install Axios
  - configure access to API
  - add to context