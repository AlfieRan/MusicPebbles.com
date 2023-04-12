# MusicPebbles.com

MusicPebbles is a simple, lightweight and fast dashboard for spotify that's built with Next.js, Redis and Spotify's Web
Api to be ultra scalable.

## Features

MusicPebbles was built with usability in mind, it's simple and easy to use, and it's fast. But it also has a few admin
only features that make it a great at catching bugs and errors before they become a problem, pairing these features with
it's incredibly small running costs means that it is built to be setup once and never require maintenance again.

Some user focused features include: Spotify Oauth Login; Spotify Song Preview Player; Uniqueness Rating of User's
Music Taste; User's Top Songs; User's Top Artists; Multiple Time Ranges (Short, Medium, Long); Summary Page for Sharing;
User Bug Reporting;

Developer focused features include: Internal Error Logging; Admin Dashboard to View User Reports and Error Logs; Error
Handling to minimise maintenance; and extremely low running costs.

The only data that is stored is data that HAS to be stored, such as any internal tokens or a cache of the user's data to
prevent unnecessary Spotify API calls, and all this data is stored such that it disappears after a short period of time.
This means that the only semi-permanent data stored are the error logs and user reports!

This works to keep the running costs of the project as low as possible, and as a byproduct also means that the project
has surprisingly high privacy and security standards.

## Limitations

If your Spotify api account has not been granted a quote extension you will only be able to invite up to 25 users
manually, in order to allow anyone to sign up like on the live site you will need to complete the application process
for a quote extension from Spotify. You can read more about this on
the [spotify developer site here](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

The Oauth state is currently just a static string that is set in the .env file, this means CSRF attacks are possible.
Although spotify's oauth flow prevents redirects to any url that hasn't been pre-approved in the developer console (such
as https://musicpebbles.com/api/oauth/callback), so as far as I know this is not a huge issue, but it is something to be
aware of since I don't take any responsibility for any security issues that may arise from using this project.

# Setup Instructions

## Requirements To Run

In order to run either a development or production instance of this project you will need the following.

| Name                | Description                                             |            Production Example             |                      Development Example                       |
|---------------------|---------------------------------------------------------|:-----------------------------------------:|:--------------------------------------------------------------:|
| Spotify Api Account | A Spotify Api Account with the ability to create an app | [Spotify](https://developer.spotify.com/) |           [Spotify](https://developer.spotify.com/)            |
| Next.js Hosting     | Some form of Next.js Hosting                            |     [Vercel](https://vercel.com/home)     |            [Nextjs Dev Tools](https://nextjs.org/)             |
| Redis Instance      | A 'Serverless Friendly' Redis Instance of Some Form     |      [Upstash](https://upstash.com/)      |               [Docker](https://www.docker.com/)                |         

## Environment Variables

You will also need to create a .env file in the root of the project with the variables in the below table, alternatively
you can copy the `.example.env` file and rename it to `.env` then fill in the values.

| Name                  | Description                                                | Type          | Example                                  |
|-----------------------|------------------------------------------------------------|---------------|------------------------------------------|
| SPOTIFY_CLIENT_ID     | The Client ID of your Spotify Api App                      | string        | 1234567890abcdef                         |
| SPOTIFY_CLIENT_SECRET | The Client Secret of your Spotify Api App                  | string        | 1234567890abcdef                         |
| SPOTIFY_REDIRECT_URI  | The Redirect URI of your Spotify Api App                   | URL           | http://localhost:3000/api/oauth/callback |
| SPOTIFY_STATE_KEY     | A Random string used as basic protection from CSRF attacks | random string | 1234567890abcdef                         |
| REDIS_URL             | The URL of your Redis Instance                             | URL           | redis://localhost:6379                   |
| JWT_SECRET            | A Random string used to sign JWT tokens                    | random string | 1234567890abcdef                         |

The additional development environment variable `LOCAL` can also be set to enable the use of the more expansive logging
tools, this is only turned on if it is set exactly to `true` and not any other value. This is not required and will be
ignored if not set.


# Built by Alfie Ranstead
This project was built by [Alfie Ranstead](https://alfieranstead.com) and is licensed under the MIT License.
Please feel free to use this project as you wish, but if you do please credit me and link back to this repository,
additionally pull requests are welcome, and if you have any questions or issues please feel free to open an issue on the repository.