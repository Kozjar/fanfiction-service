import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import NovelPreview from './novelPreview';
import '../styles/home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    fetch('http://localhost:8000/api/novels/lastUpdated')
    .then(res => res.json())
    .then(json => this.setState({lastUpdatedNovels: json}));

    fetch('http://localhost:8000/api/novels/topRated')
    .then(res => res.json())
    .then(json => this.setState({topRatedNovels: json}));

    // fetch('http://localhost:8000/api/novels/new', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8'
    //   },
    //   body: JSON.stringify({
    //     title: 'Default title 2',
    //     author_name: 'Ankirig',
    //     description: 'some default description heh mda',
    //     chapters: [{name: 'intro', text: 'hehehehe'}, {name: 'final', text: 'oohoho'}],
    //     comments: [],
    //     genres: ['Sci-Fi', 'Action']
    //   })
    // })
    // .then(res => console.log(res));
  }

  state = {
    lastUpdatedNovels: [],
    topRatedNovels: []
  }

  render() { 
    return ( 
      <main>
        <button onClick={() => fetch('/api/testCookie', {
              method: 'GET',
              credentials: 'same-origin',
            }).then(console.log('test cookie finished'))}>test cookie</button>
        <button onClick={() => fetch('/api/initCookie', {
            method: 'GET',
            credentials: 'same-origin',
          }).then(console.log('init cookie finished'))}>init cookie</button>
        <div className="container">
          <div className="card latest-updates__wrapper novel-group">
            <div className="card-header">Latest updates</div>
            <div className="card-body">
              {
                this.state.lastUpdatedNovels.map((novel, i) =>
                  <NovelPreview key={i}
                                title={novel.title}
                                total_rate={novel.total_rate}
                                genres={novel.genres} />
                )
              }
            </div>
          </div>
          <div className="card top-rated__wrapper novel-group">
            <div className="card-header">Top rated</div>
            <div className="card-body">
              {
                this.state.topRatedNovels.map((novel, i) =>
                  <NovelPreview key={i}
                                title={novel.title}
                                total_rate={novel.total_rate}
                                genres={novel.genres} />
                )
              }
            </div>
          </div>
        </div>
      </main>
    );
  }
}
 
export default withRouter(Home);