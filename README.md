# Portfolio - fixed setup

## Fixes included
- Resume upload route is registered before the 404 handler.
- Resume uploads accept PDF files up to 5 MB.
- CORS allows credentialed admin requests.
- Upload errors are returned clearly.
- The supplied Aman logo is used in the navbar and browser favicon.
- MongoDB connection now retries and prints a useful SRV/DNS diagnostic.
- Added `server/.env.example`.

## Run
Server: `cd server && npm install && npm run dev`
Client: `cd client && npm install && npm run dev`

## MongoDB Atlas
If you see `querySrv ECONNREFUSED`, the machine cannot resolve the Atlas SRV DNS record. Check: database credentials; Atlas Network Access/IP allowlist; Windows DNS/VPN/firewall. Verify with:

`nslookup -type=SRV _mongodb._tcp.cluster0.ffgykbg.mongodb.net`

You can also run `ipconfig /flushdns`. If your network cannot resolve SRV records, copy the standard non-SRV driver URI from Atlas **Connect -> Drivers** and use it as `MONGO_URI`.

## Admin login
The admin account is stored in MongoDB. The values in `server/.env` are used to create/reset the account.

If the admin page says `Invalid credentials` even though the email/password in `server/.env` are correct, update the database account once with:

`cd server`

`npm run create-admin`

The command now **creates the admin if it does not exist and resets its password if it already exists**. After it finishes, restart the server and sign in using the exact `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `server/.env`.

Do not put the password in the frontend code. The frontend sends the login request to `POST /api/auth/login`, and the server checks the hashed password in MongoDB.

## Resume upload
The admin profile page calls `POST /api/resume`. The route is now registered before the 404 handler and browser cookies are enabled through CORS credentials.

## Security
The uploaded project contains live-looking MongoDB, Cloudinary, JWT, and admin credentials. If they are real, rotate them before sharing/deploying and keep `.env` out of Git.
