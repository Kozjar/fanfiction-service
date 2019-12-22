import React, { Component } from 'react'
import Media from 'react-bootstrap/Media'
import { connect } from 'react-redux';

class Novel extends Component {
  constructor(props) {
    super(props);
    this.id = window.location.pathname.match(/(?!^)\/(.+)$/)[1];
  }
  componentDidMount() {
    fetch(`/api/novels/${this.id}`)
    .then(res => {
      if (res.ok) return res.json()
      else throw new Error(res);
    })
    .then(res => this.setState({novel: res}))
    .catch(err => console.log(err));
  }

  state = {
    novel: undefined,
  }

  render() {
    const { novel } = this.state;
    if (this.state.novel) {
      return ( 
        <main className="container">
          <h1>{novel.title}</h1>
          <Media>
            <img
              width={250}
              height={350}
              alt="Novel image"
            />
            <Media.Body>
              <h5>{this.props.t.t('Novel.information')}</h5>
              <ul className="list-unstyled">
                <li>
                  <span>{this.props.t.t('Novel.author')}: </span>
                  {novel.author_name}
                </li>
                <li>
                  <span>{this.props.t.t('Novel.genres')}: </span>
                  action, sci-fi
                </li>
                <li>
                  <span>{this.props.t.t('Novel.last_update')}: </span>
                  {new Date(novel.last_update).toISOString()}
                </li>
                <li>
                  <span>{this.props.t.t('Novel.upload_date')}: </span>
                  {new Date().toISOString()}
                </li>
                <li>
                  <span>{this.props.t.t('Novel.rating')}: </span>
                  {novel.total_rate}
                </li>
              </ul>
            </Media.Body>
          </Media>
        </main>
      );
    }
    else return (<></>)
  }
}

const mapStateToProps = (state) => {
  return {
    t: state.i18n
  }
}
 
export default connect(mapStateToProps)(Novel);