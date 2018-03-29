import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);

        this.state = {
        	searchResults: [
                {
                    name: 'I Fucked Bexey',
                    artist: 'Lil Jules',
                    album: 'Bexey Jizz EP'
                },
                {
                    name: 'Lean In My Cup, Fat Nick In My Mouth',
                    artist: 'Lil Jules',
                    album: 'The Purple Cup Chronicles'
                },
                {
                    name: 'Xanax Godz Pt. 2',
                    artist: 'Lil Jules',
                    album: 'Lil Peep Religion'
                }
            ],
            playlistName: 'Test Playlist',
            playlistTracks: [
                {
                    name: '6AM Dalaran Sewers ft. Yung Thangos',
                    artist: 'Lil Jules',
                    album: 'Insomnia'
                },
                {
                    name: 'Autistic Screeching',
                    artist: 'Lil Jules',
                    album: 'My First EP'
                }
            ],
        }
    }

    // Add Track to Playlist
    addTrack(track) {
        // Check if track is not in the playlist (playlistTracks)
        if (this.state.playlistTracks.every(playlistTrack => playlistTrack.id !== track.id)) {
			// Add to end of playlist
            let newPlaylistTracks = this.state.playlistTracks.concat(track);
            // Set new state of the playlist
			this.setState({playlistTracks: newPlaylistTracks});
        }
    }
    // Remove Track from Playlist
    removeTrack(track) {

        let newPlaylistTracks = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
            
        this.setState({playlistTracks: newPlaylistTracks});
    }
    // Change that Playlist Name boi!
    updatePlaylistName(name) {
        this.setState({playlistName: name});
    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar />
                    <div className="App-playlist">
                        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
                        <Playlist 
                            playlistName={this.state.playlistName} 
                            playlistTracks={this.state.playlistTracks}
                            onRemove={this.removeTrack}
                            onNameChange={this.updatePlaylistName} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
