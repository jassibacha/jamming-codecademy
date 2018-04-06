import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);

        this.state = {
        	searchResults: [],
            playlistName: 'New Playlist',
            playlistTracks: [],
        }
    }

    // Add Track to Playlist
    addTrack(track) {
        // Check if track is not in the playlist (playlistTracks)
        if (this.state.playlistTracks.every(playlistTrack => playlistTrack.id !== track.id)) {
			// Add to end of playlist
      let index = this.state.searchResults.findIndex((searchTrack) => { searchTrack.id === track.id})
			let searchResults = this.state.searchResults.splice(index - 1, index);
            let newPlaylistTracks = this.state.playlistTracks.concat(track);
            // Set new state of the playlist
			this.setState({playlistTracks: newPlaylistTracks, searchResults: searchResults});
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

    // Save the Playlist!
    savePlaylist() {
        //Generates an array of uri values called trackURIs from the playlistTracks property.
        let trackURIs = this.state.playlistTracks.map(track => track.uri);
        // Save playlist to spotify
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        // Reset the playlist on our end!
        this.setState({
          searchResults: []
        });
        this.updatePlaylistName('New Playlist');

        console.log('Save Playlist Fired! Array Info:')
        console.info(trackURIs);

    }

    // Search Spotify
    //search(searchTerm) {
        //console.log(searchTerm);
        //Spotify.search(searchTerm).then(tracks => this.setState({searchResults: tracks}));
        
    //}

    search(term) {
        Spotify.search(term).then(searchResults => {
        		let filteredResults = this.filterSearchResults(searchResults);
            this.setState({searchResults: filteredResults});
        });  

        console.log('Search fired! Line 108 App.js');
    }
    
    filterSearchResults(searchResults) {
      // filter searchResults!
      return searchResults.filter((searchTrack) => {
          // check playlistTracks to see if there's any matching id, instantly
          // return (instead of continuing the iteration) and return false to remove it
          return !this.state.playlistTracks.some((playlistTrack) => {
              searchTrack.id === playlistTrack.id
          });
      });
		}

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={this.search} />
                    <div className="App-playlist">
                        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
                        <Playlist 
                            playlistName={this.state.playlistName} 
                            playlistTracks={this.state.playlistTracks}
                            onRemove={this.removeTrack}
                            onNameChange={this.updatePlaylistName}
                            onSave={this.savePlaylist} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;