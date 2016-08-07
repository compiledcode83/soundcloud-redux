import classNames from 'classnames';
import React from 'react';


class SearchBar extends React.Component {
  static propTypes = {
    handleSearch: React.PropTypes.func.isRequired,
    search: React.PropTypes.object.isRequired
  };

  constructor() {
    super(...arguments);
    this.handleSubmit = ::this.handleSubmit;
  }

  componentDidMount() {
    this.searchBar.addEventListener('transitionend', () => {
      if (this.props.search.open) this.input.focus();
    }, false);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.search.open) this.input.value = '';
  }

  handleSubmit(event) {
    event.preventDefault();
    const value = this.input.value.trim();
    this.input.blur();
    this.props.handleSearch(value);
  }

  render() {
    const cssClasses = classNames('search-bar', {
      'search-bar--open': this.props.search.open
    });

    return (
      <div className={cssClasses} ref={e => this.searchBar = e} role="search">
        <form className="search-form" onSubmit={this.handleSubmit} noValidate>
          <input
            autoComplete="off"
            className="search-form__input"
            maxLength="60"
            placeholder="Search Tracks"
            ref={e => this.input = e}
            tabIndex="0"
            type="text"
          />
        </form>
      </div>
    );
  }
}

export default SearchBar;
