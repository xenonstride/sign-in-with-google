**Sign In With Google Button Demo**

**credentials in config.env redacted for security reasons**

i) password for mongodb url

ii) Google API Client ID and Secret

Routes -

i)
/ - Sign In with Google Button

- shows a sign in with google button, redirects to the google website to sign in
- after logging in with an account, basic info like email, name, photo will be saved to DB
- a JWT token will be sent to the client and user will be logged in
- will not save to the DB if the account already exists

ii)
/home

- Shows the details of the user
- fetched from the DB with the JWT token from the client
- Shows a button (Show my files) to use OAuth to get a Auth code with the required scopes
- Then uses an endpoint on the backend to use that Auth code and get an Access Token and Refresh token
- Saves the refresh token to the DB for future use

iii)
/my-files

- Uses google OAuth client library to generate an access token by sending request to the backend
- Backend sends back an access token to use Google APIs at the client side
- Calls Google Drive API to list the current user's files
