import React, { useState, useEffect } from 'react'
import Media from 'react-bootstrap/Media'
import ListGroup from 'react-bootstrap/ListGroup'
import { connect } from 'react-redux';
import Col from 'react-bootstrap/Col';
import '../styles/novel.css'

import startActive from '../img/star_active.png'
import startDisable from '../img/star_white.png'
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';


const Novel = (props) => {

  const [novel, setNovel] = useState();
  const [stars, setStars] = useState(0);
  const [userRate, setUserRate] = useState(0);
  const [accessStatus, setAccessStatus] = useState(0);

  useEffect(() => {
    fetch(`/api/novels/${props.match.params.id}`)
    .then(res => {
      if (res.ok) return res.json()
      else throw new Error(res);
    })
    .then(res => {
      setNovel(res.novel);
      setUserRate(res.userRate);
      setStars(res.userRate);
      setAccessStatus(res.accessStatus);
    })
    .catch(err => console.log(err));
  }, [])

  const rateNovel = e => {
    if (e.target.tagName === 'IMG') {
      setUserRate(stars);
      fetch('/api/novels/rate', {
        method: 'PUT',
        
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          novelId: props.match.params.id,
          rate: stars
        })
      })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(res => setNovel({
        ...novel, 
        total_rate: res.total_rate,
        rate_count: res.rate_count
      }))
      .catch(err => console.log(err));
    }
  }

  if (novel) {
    return ( 
      <main className="container">
        <div className='novel-header'>
          <h1>{novel.title}</h1>
          <div className='userRating' onClick={e => rateNovel(e)}>
            {console.log(accessStatus)}
            {
              (accessStatus === 2) ? (
                <LinkContainer to={`/editNovel/${props.match.params.id}`}>
                  <Button>Edit</Button>
                </LinkContainer>
              ) : (<></>)
            }
          {
              (accessStatus > 0) ? (
                <>
            <span>your rate:</span> 
            <img src={stars >= 1 ? startActive : startDisable} alt='star'
                  onMouseEnter={() => setStars(1)} width={30} height={30}
                  onMouseLeave={() => setStars(userRate)}/>
            <img src={stars >= 2 ? startActive : startDisable} alt='star'
                  onMouseEnter={() => setStars(2)} width={30} height={30}
                  onMouseLeave={() => setStars(userRate)}/>
            <img src={stars >= 3 ? startActive : startDisable} alt='star'
                  onMouseEnter={() => setStars(3)} width={30} height={30}
                  onMouseLeave={() => setStars(userRate)}/>
            <img src={stars >= 4 ? startActive : startDisable} alt='star'
                  onMouseEnter={() => setStars(4)} width={30} height={30}
                  onMouseLeave={() => setStars(userRate)}/>
            <img src={stars >= 5 ? startActive : startDisable} alt='star'
                  onMouseEnter={() => setStars(5)} width={30} height={30}
                  onMouseLeave={() => setStars(userRate)}/>
                  </>) : (<></>)
              }
          </div>
        </div>
        <Media>
          <img
            width={250}
            height={350}
            alt="Novel"
          />
          <Media.Body>
            <h5 className='section-title'>{props.t.t('Novel.information')}</h5>
              <ListGroup className='information__wrapper' variant="flush">
                <ListGroup.Item>
                  <Col className='info-title' sm={5} lg={3}>{props.t.t('Novel.author')} </Col>
                  {novel.author_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Col className='info-title' sm={5} lg={3}>{props.t.t('Novel.genres')} </Col>
                  {novel.genres.map(id => props.genresPool[id]).join(', ')}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Col className='info-title' sm={5} lg={3}>{props.t.t('Novel.last_update')} </Col>
                  {new Date(novel.last_update).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Col className='info-title' sm={5} lg={3}>{props.t.t('Novel.upload_date')} </Col>
                  {new Date(novel.upload_date).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Col className='info-title' sm={5} lg={3}>{props.t.t('Novel.rating')} </Col>
                  {+novel.total_rate.toFixed(2)}  (votes: {novel.rate_count})
                </ListGroup.Item>
              </ListGroup>
            
          </Media.Body>
        </Media>
        <h5 className='section-title'>{props.t.t('Novel.description')}</h5>
        <div className='mb-5'>{novel.description}</div>
        
        <h5 className='section-title'>{props.t.t('Novel.chapters')}</h5>
        <ListGroup className='chapters-wrapper'>
          {
            novel.chapters.map((chapter, i) => (
              <ListGroup.Item className='p-2' as={Link} 
                to={`/novel/${props.match.params.id}/chapter/${i}`} 
                key={i}>
                  Chapter {i + 1} – {chapter.name}
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      </main>
    );
  }
  else return (<></>)
}

const mapStateToProps = (state) => {
  return {
    t: state.language.i18n,
    genresPool: state.language.genres.val
  }
}
 
export default connect(mapStateToProps)(Novel);