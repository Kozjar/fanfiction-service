import React from 'react'
import '../styles/novelPreview.css';
import star from '../img/star_active.png';

export default function NovelPreview(props) {
  return (
    <div className="novel-preview__wrapper">
      <div className="rounded novel-preview__img-overlay"></div>
      <div className="rounded novel-preview__img"></div>
      <div className="novel-preview__title">{props.title}</div>
      <div className="novel-preview__genres">
        {`${props.genres[0]}${props.genres[1] ? `, ${props.genres[1]}` : ''}`}
      </div>
      <div className="media">
        <div className="novel-preview__rate mr-1">({props.total_rate})</div>
        <img src={star} alt="star" height="16" width="16"></img>
      </div>
    </div>
  )
}