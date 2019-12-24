import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux';

import ChapterEdit from './chapterEdit'

import '../styles/editNovel.css'

import tmpImg from '../img/gray-img.png'
import { Redirect } from 'react-router-dom'

const FormExample = (props) => {

  const [validated, setValidated] = useState(false);
  const [choosenGenres, setGenres] = useState([]);
  const [genresPool, setGenresPool] = useState([]);
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [chapters, setChapters] = useState([{name: '', text: ''}]);

  const handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() !== false) {
      const id = props.match.params.novelId;
      fetch(`/api/novels/${id ? id : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          title,
          authorName: props.username,
          description: desc,
          chapters,
          genres: choosenGenres
        })
      })
      .then(res => {
        if (!res.ok)  throw new Error(res.statusText);
      })
      .catch(err => console.log(`failed to apload: ${err}`));
    }

    setValidated(true);
  };

  const removeGenre = (i) => {
    const tmpGenres = choosenGenres;

    const pool = genresPool;
    pool.push(choosenGenres[i]);
    setGenresPool(pool);
    
    tmpGenres.splice(i, 1);
    setGenres([...tmpGenres]);
  }

  const addGenre = (i) => {
    const tmpGenres = choosenGenres;

    const pool = genresPool;
    tmpGenres.push(genresPool[i]);
    setGenres([...tmpGenres]);
    
    pool.splice(i, 1);
    setGenresPool([...pool]);
  }

  useEffect(() => {
    setGenresPool(props.genres.map((o, i) => i));
    if (props.match.params.novelId) {
      fetch(`/api/novels/forEdit/${props.match.params.novelId}`)
      .then(res => {
        if (res.ok) return res.json()
        else throw new Error(res);
      })
      .then(res => {
        setGenres(res.genres)
        setDesc(res.description)
        setTitle(res.title)
        setChapters(res.chapters)
      })
      .catch(err => console.log(err))
    }
  }, [])
  
  if (!props.username) return (<Redirect to='/'/>)

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="lg"
            type="text"
            placeholder="Enter your novel title"
          />
        </Form.Group>
        <div className="info-img__form-wrapper">
          <img
            width={200}
            height={290}
            src={tmpImg}
            alt="Novel"
          />
          <div className="info__form">
            <h5>{props.t.t('Novel.information')}</h5>
            <Form.Group as={Row} className="genres-form">
              <Form.Label column sm={2}>
                Genres
              </Form.Label>
              <div className='col-sm-10'>
                {
                  choosenGenres.map((genre, i) =>
                    <Button size="sm" className='genre-btn' key={i}
                            onClick={removeGenre.bind(this, i)}>
                      {props.genres[genre]}
                      <span>x</span>
                    </Button>
                  )
                }
                <Card>
                  <Card.Header className='p-1'>{props.t.t('Novel_edit.choose_genres')}</Card.Header>
                  <Card.Body className='p-0'>
                  {
                    genresPool.map((genre, i) =>
                      <Button size="sm" className='genre-btn' key={i}
                              onClick={addGenre.bind(this, i)}>
                        {props.genres[genre]}
                        <span>+</span>
                      </Button>
                    )
                  }
                  </Card.Body>
                </Card>
              </div>
            </Form.Group> 

            <Form.Group controlId="formHorizontalPassword">
              <Form.Label>
              {props.t.t('Novel.description')}
              </Form.Label>
              <Form.Control as="textarea" rows="5" value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Enter your description here" required />
            </Form.Group>
          </div>
        </div>

        <ChapterEdit 
          chapters={chapters}
          setChapters={setChapters}/>

        <Button type="submit">Submit form</Button>
      </Form>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    t: state.language.i18n,
    genres: state.language.genres.val,
    username: state.user.name
  }
}
 
export default connect(mapStateToProps)(FormExample);