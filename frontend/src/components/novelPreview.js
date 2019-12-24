import React from 'react'
import '../styles/novelPreview.css';
import star from '../img/star_active.png';
import { connect } from 'react-redux';

import { Link } from "react-router-dom";

function NovelPreview(props) {
  return (
    <Link to={`/novel/${props.id}`} className="novel-preview__wrapper">
      <div className="rounded novel-preview__img-overlay"></div>
      <div className="rounded novel-preview__img"></div>
      <div className="novel-preview__title">{props.title}</div>
      <div className="novel-preview__genres">
        {`${props.genresPool[props.genres[0]]}${props.genresPool[props.genres[1]] ? 
          `, ${props.genresPool[props.genres[1]]}` : ''}`}
      </div>
      <div className="media">
        <div className="novel-preview__rate mr-1">({+props.total_rate.toFixed(2)})</div>
        <img src={star} alt="star" height="16" width="16"></img>
      </div>
    </Link>
  )
}

const mapStateToProps = (state) => {
  return {
    genresPool: state.language.genres.val
  }
}

export default connect(mapStateToProps)(NovelPreview)