import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';
import { List } from 'immutable';
import { getBrowserMedia, infiniteScroll } from 'src/core/browser';
import { audio, getPlayerIsPlaying, getPlayerTrackId, playerActions } from 'src/core/player';
import { getCurrentTracklist, getTracksForCurrentTracklist, tracklistActions } from 'src/core/tracklists';

import LoadingIndicator from '../loading-indicator';
import TrackCard from '../track-card';


export class Tracklist extends React.Component {
  static propTypes = {
    compactLayout: React.PropTypes.bool,
    displayLoadingIndicator: React.PropTypes.bool.isRequired,
    isMediaLarge: React.PropTypes.bool.isRequired,
    isPlaying: React.PropTypes.bool.isRequired,
    loadNextTracks: React.PropTypes.func.isRequired,
    pause: React.PropTypes.func.isRequired,
    pauseInfiniteScroll: React.PropTypes.bool.isRequired,
    play: React.PropTypes.func.isRequired,
    selectTrack: React.PropTypes.func.isRequired,
    selectedTrackId: React.PropTypes.number,
    tracklistId: React.PropTypes.string.isRequired,
    tracks: React.PropTypes.instanceOf(List).isRequired
  };

  componentDidMount() {
    infiniteScroll.start(
      this.props.loadNextTracks,
      this.props.pauseInfiniteScroll
    );
  }

  componentWillUpdate(nextProps) {
    if (nextProps.pauseInfiniteScroll !== this.props.pauseInfiniteScroll) {
      if (nextProps.pauseInfiniteScroll) {
        infiniteScroll.pause();
      }
      else {
        infiniteScroll.resume();
      }
    }
  }

  componentWillUnmount() {
    infiniteScroll.end();
  }

  render() {
    const { compactLayout, isMediaLarge, isPlaying, pause, play, selectedTrackId, selectTrack, tracklistId, tracks } = this.props;

    const tracklistClassName = classNames('g-row  g-cont tracklist', {
      'has-line-clamp': '-webkit-line-clamp' in document.body.style
    });

    const trackCardClassName = classNames('g-col', {
      'sm-2/4 md-1/3 lg-1/4': compactLayout || !isMediaLarge
    });

    const trackCards = tracks.map((track, index) => {
      let isSelected = track.id === selectedTrackId;
      return (
        <div className={trackCardClassName} key={index}>
          <TrackCard
            isCompact={compactLayout || !isMediaLarge}
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
      <div className={tracklistClassName}>
        {trackCards}

        <div className="g-col">
          {(this.props.displayLoadingIndicator) ? <LoadingIndicator /> : null}
        </div>
      </div>
    );
  }
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
  getBrowserMedia,
  getPlayerIsPlaying,
  getPlayerTrackId,
  getCurrentTracklist,
  getTracksForCurrentTracklist,
  (media, isPlaying, playerTrackId, tracklist, tracks) => ({
    displayLoadingIndicator: tracklist.isPending || tracklist.hasNextPage,
    isMediaLarge: !!media.large,
    isPlaying,
    pause: audio.pause,
    pauseInfiniteScroll: tracklist.isPending || !tracklist.hasNextPage,
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
