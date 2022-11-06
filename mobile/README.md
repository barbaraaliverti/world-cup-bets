## Class 3 - Mobile Layout

### Sign in page
- Install React Native SVG transformer so that I can use svg files as components
- Create metro.config.js file
- import Logo as a component
- create @types folder for custom types, so typesript allows svg files to be imported as components (default component type is tsx)
- create Button component
  - Use Button from NativeBase
  - Add types
  - Extend IButtonProps types
  - @expo/vector-icons for icons
- Add text and its styles to finish Sign in page

### Context
- Create a context with React Context API to allow for some content to be accessible with authentication
- src/contexts/AuthContext.tsx
- create the context to store user data
- create a hook to share the auth context
- add AuthContext to the app (App.tsx)
- Add the useAuth hook to the Sign in page so I can access signIn function and user info

### Authentication with Google account
#### OAuth2
- OAuth2 is a safe authentication protocol
1) IDP - Identity Provider - register app in Google console
2) User requests authentication
3) Google validates the authentication
4) Google returns a auth token 
5) My app redirects the user back to the app with the generated token (redirect deep link)
- Steps 3 and 4 - PKCE layer (Proof of Key Code Exchange) - safe layer to ensure that only the app that started the auth flow can change the token for a JWT

#### Install auth packages:
- [expo-auth-session](https://www.npmjs.com/package/expo-auth-session)
- expo-random
- expo-web-browser
- Add a scheme to app.json (for the token redirect after auth)

#### [Google console](https://console.cloud.google.com/)
- create a new project 
- APIs and services -> credentials
- create credentials -> permission screen -> publish
- create new OAuth ID
  - JS origin URI (check expo-auth-session documentation) 
- For the redirect:
 - in AuthContext, use AuthSession from expo-auth-session
- create the auth request for Google
- save user info as a state

### New pages
- Create pool
- Find Pool
- Show all pools
