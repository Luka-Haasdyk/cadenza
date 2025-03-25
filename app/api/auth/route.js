import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    const queryParams = new URLSearchParams({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: "streaming user-read-email user-read-private",
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    });
    return NextResponse.redirect(
      `https://accounts.spotify.com/authorize?${queryParams}`
    );
  }

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Redirect to EntryArea with token in URL
    const redirectUrl = new URL("/EntryArea", request.url);
    redirectUrl.searchParams.set("access_token", access_token);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during token exchange:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
