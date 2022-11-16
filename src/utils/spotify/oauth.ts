export function OauthLoginUrl(
    ClientId: string,
    RedirectUri: string,
    State: string
): string {
    const scopes = [
        "user-read-private",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-top-read",
    ];
    const url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.append("client_id", ClientId);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", RedirectUri);
    url.searchParams.append("state", State);
    url.searchParams.append("scope", scopes.join(" "));
    url.searchParams.append("show_dialog", "true");
    return url.toString();
}
