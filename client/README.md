# YAITS Client (React)

## Running locally

1. Prerequisites: `node` (>=10) and `npm`
2. `npm i` to install dependencies
3. `npm test` to verify
4. `npm run start` to begin development server
5. Access `http://localhost:3000` in browser

   - Requests to `/api` are proxied to the Python server

## TODO/TBD:

- If API call 401s, try requesting new accessToken via refreshToken
  - If refresh success, retry original request with new token
  - If refresh token fails, redirect to home (will logout user)
- Add UI to create custom issue statuses for teams
- Websocket support
