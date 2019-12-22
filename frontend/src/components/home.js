import React, { Component } from 'react';
import NovelPreview from './novelPreview';
import { connect } from 'react-redux';
import '../styles/home.css';

class Home extends Component {

  state = {
    loadingLastUpdated: true,
    loadingTopRated: true,
    lastUpdatedNovels: [],
    topRatedNovels: []
  }

  componentDidMount() {
    fetch('/api/novels/lastUpdated')
    .then(res => res.json())
    .then(json => this.setState({lastUpdatedNovels: json, loadingLastUpdated: false}));

    fetch('/api/novels/topRated')
    .then(res => res.json())
    .then(json => this.setState({topRatedNovels: json, loadingTopRated: false}));
  }

  render() { 
    return ( 
      <main>
        <div className="container">
          <div className="card latest-updates__wrapper novel-group">
            <div className="card-header">{this.props.i18n.t('Home.Latest_updates')}</div>
            <div className="card-body">
              {!this.state.loadingLastUpdated ? (
                this.state.lastUpdatedNovels.map((novel, i) =>
                  <NovelPreview key={i}
                                id={novel._id}
                                title={novel.title}
                                total_rate={novel.total_rate}
                                genres={novel.genres} />
                )
              ) : (
                <div className="spinner-wrapper">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="card top-rated__wrapper novel-group">
            <div className="card-header">{this.props.i18n.t('Home.Top_rated')}</div>
            <div className="card-body">
              {!this.state.loadingTopRated ? (
                this.state.topRatedNovels.map((novel, i) =>
                  <NovelPreview key={i}
                                id={novel._id}
                                title={novel.title}
                                total_rate={novel.total_rate}
                                genres={novel.genres} />
                )
              ) : (
                <div className="spinner-wrapper">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    i18n: state.i18n
  }
}
 
export default connect(mapStateToProps)(Home);