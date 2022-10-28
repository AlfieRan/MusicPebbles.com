export function OauthLoginUrl(
    ClientId: string,
    RedirectUri: string,
    State: string
): string {
    const scopes = [
        "user-read-private",
        "user-read-email",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-top-read",
        "user-read-recently-played",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
        "playlist-modify-private",
    ];
    const url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.append("client_id", ClientId);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", RedirectUri);
    url.searchParams.append("state", State);
    url.searchParams.append("scope", scopes.join(" "));
    return url.toString();
}
