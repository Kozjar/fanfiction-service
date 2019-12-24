import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom'
import '../styles/novelChapter.css'
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap'
import { Remarkable } from 'remarkable';

const NovelChapter = props => {

  const md = new Remarkable();

  const [chapters, setChapters] = useState([]);
  const [activeChapter, setActiveChapter] = useState([]);
  const [title, setTitle] = useState([]);

  const loadChapter = () => {
    fetch(`/api/novels/${props.match.params.id}/chapter/${props.match.params.chapterId}`)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json();
    })
    .then(res => {
      setChapters([...res.chapters]);
      setActiveChapter(res.activeChapter);
      setTitle(res.title);
    })
    .catch(err => console.log(err));
  }

  useEffect(() => {
    loadChapter();
  }, [props.match.params.chapterId])

  return (
    <Container>
      <Row>
        <Col className='bg-light' md={8} lg={9}>
          <h3 className='chapter-header'>
            <Link to={`/novel/${props.match.params.id}`}>{title}: </Link>
            Chapter {Number.parseInt(props.match.params.chapterId) + 1} – {activeChapter.name}
          </h3>
          <div className='preview__text overflow-auto' 
               dangerouslySetInnerHTML={{__html: md.render(activeChapter.text)}}>
          </div>
        </Col>
        <Col className='p-0' md={4} lg={3}>
          <Nav className="chapters-list flex-column">
            {
              chapters.map((chapter, i) => (
                <LinkContainer to={`/novel/${props.match.params.id}/chapter/${i}`} 
                  key={i}>
                  <Nav.Link >
                    Chapter {i + 1} – {chapter.name}
                  </Nav.Link>
                </LinkContainer>
              ))
            }
          </Nav>
        </Col>
      </Row>
    </Container>
  )
}

export default NovelChapter;
