const clientId = 'f717c044281e46b088f1a3e272fb87ac';
const redirectUri = 'http://localhost:3000/';
const spotifyUrl = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`;

let accessToken = undefined;
let expiresIn = undefined;

const Spotify = {
    getAccessToken() {
        // Check if we have the token, if so, return it.
        if (accessToken) {
            return accessToken;
            //console.log('We have an access token! Line: 13 Spotify.js');
        }

        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

        // Check if access token and expiration time are present in the url
        if (urlAccessToken && urlExpiresIn) {
            accessToken = urlAccessToken[1];
            expiresIn = urlExpiresIn[1];
            // Wipe the parameters from the URL so the app doesnt try to grab it after its expired
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            console.log('Token and Expiration are present: Line 26 Spotify.js');
        } else {
            // Check if token variable is empty and not in URL
            window.location = spotifyUrl;
        }
    },

    search(term) {
        const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        return fetch(searchUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => response.json())
        .then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
            })
        });
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris) {
            return;
        }
        const userUrl = 'https://api.spotify.com/v1/me';
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        //let accessToken = 'usersaccesstoken'
        let userId = undefined;
        let playlistId = undefined;

        fetch(userUrl, {
            headers: headers
        })
        .then(response => response.json())
        .then(() => {
            const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
            fetch(createPlaylistUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: name
                })
            })
            .then(response => response.json())
            .then(jsonResponse => playlistId = jsonResponse.id)
            .then(() => {
                const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
                fetch(addPlaylistTracksUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                      uris: trackUris
                    })
                });
            })
        })
    
    }
};

export default Spotify;