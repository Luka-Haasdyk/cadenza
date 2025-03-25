import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  console.log('Code:', code); // Debugging: Log the code

  // If no code, redirect to Spotify authorization
  if (!code) {
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'streaming user-read-email user-read-private',
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    });
    const authUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
    console.log('Redirecting to Spotify:', authUrl); // Debugging: Log the auth URL
    return NextResponse.redirect(authUrl);
  }

  // Exchange code for access token
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = response.data;
    console.log('Access Token:', access_token); // Debugging: Log the access token

    // Redirect to the frontend with the access token
    const frontendUrl = `http://localhost:3000/EntryArea?access_token=${access_token}`;
    console.log('Redirecting to Frontend:', frontendUrl); // Debugging: Log the frontend URL
    return NextResponse.redirect(frontendUrl);
  } catch (error) {
    console.error('Error during token exchange:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}