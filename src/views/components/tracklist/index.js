import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { List } from 'immutable';
import { audio, getPlayerIsPlaying, getPlayerTrackId, playerActions } from 'src/core/player';
import { getCurrentTracklist, getTracksForCurrentTracklist, tracklistActions } from 'src/core/tracklists';
import TrackCard from '../track-card';


export class Tracklist extends React.Component {
  static propTypes = {
    hasNextPage: React.PropTypes.bool.isRequired,
    isPending: React.PropTypes.bool.isRequired,
    isPlaying: React.PropTypes.bool.isRequired,
    loadNextTracks: React.PropTypes.func.isRequired,
    pause: React.PropTypes.func.isRequired,
    play: React.PropTypes.func.isRequired,
    selectTrack: React.PropTypes.func.isRequired,
    selectedTrackId: React.PropTypes.number,
    tracklistId: React.PropTypes.string.isRequired,
    tracks: React.PropTypes.instanceOf(List).isRequired
  };

  renderPaginationButton() {
    return (
      <div className="g-col">
        <button onClick={this.props.loadNextTracks} type="button">Next</button>
      </div>
    );
  }

  render() {
    const { isPlaying, pause, play, selectedTrackId, selectTrack, tracklistId, tracks } = this.props;

    const trackCards = tracks.map((track, index) => {
      let isSelected = track.id === selectedTrackId;
      return (
        <div className="g-col" key={index}>
          <TrackCard
            isPlaying={isSelected && isPlaying}
            isSelected={isSelected}
            pause={pause}
            play={isSelected ? play : selectTrack.bind(null, track.id, tracklistId)}
            track={track}
          />
        </div>
      );
    });

    return (
      <div className="g-row tracklist">
        {trackCards}

        <div>{this.props.isPending ? <h1>LOADING TRACKS</h1> : null}</div>
        {this.props.hasNextPage ? this.renderPaginationButton() : null}
      </div>
    );
  }
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
  getPlayerIsPlaying,
  getPlayerTrackId,
  getCurrentTracklist,
  getTracksForCurrentTracklist,
  (isPlaying, playerTrackId, tracklist, tracks) => ({
    hasNextPage: tracklist.hasNextPage,
    isPending: tracklist.isPending,
    isPlaying,
    pause: audio.pause,
    play: audio.play,
    selectedTrackId: playerTrackId,
    tracklistId: tracklist.id,
    tracks
  })
);

const mapDispatchToProps = {
  loadNextTracks: tracklistActions.loadNextTracks,
  selectTrack: playerActions.playSelectedTrack
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tracklist);
