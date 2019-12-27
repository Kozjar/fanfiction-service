import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import DefaultPagination from './pagination'
import { Link } from 'react-router-dom'

import openSocket from 'socket.io-client';

import '../styles/comments.css'
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

let socket = undefined;

const Comment = (props) => {
  const dateOptions = {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }

  const getDate = () => {
    const opt = { hour12: false, hour: 'numeric', minute: 'numeric' }
    const date = new Date(props.date);
    const now = new Date();
    if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
      if (date.getDate() === now.getDate()) 
        return `Today in ${date.toLocaleString('en-US', opt)}`
      if (date.getDate() === now.getDate() - 1)
        return `Yesterday in ${date.toLocaleString('en-US', opt)}`
    }
    return date.toLocaleString('en-US', dateOptions)
  }
  
  return (
    <ListGroup.Item className='flex-wrap align-content-center'>
      <strong className='mb-2'>{props.username}</strong>
      <span className='comment-date'>{getDate()}</span>
      <pre className='mb-0 w-100 text-break'>{props.text}</pre>
    </ListGroup.Item>
  )
}

const CommentsSection = (props) => {
  const [userComment, setUserComment] = useState('');
  const [comments, setComments] = useState(undefined);
  const [currentPage, setCurrenrPage] = useState(1);

  function loadComments(page) {
    fetch(`/api/novels/comments/${props.novelId}/${page - 1}`)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      else return res.json();
    })
    .then(res => {
      setComments([...res]);
      setCurrenrPage(Number.parseInt(page));
    })
    .catch(err => console.log(err));
  }

  function handleCHangePage(page) {
    loadComments(page);
  }

  useEffect(() => {
    loadComments(1);

    socket = openSocket();

    socket.on('connect', data => {
      socket.emit('join', props.novelId);
    });

    socket.on('newComment', data => {
      if (currentPage === 1) {
        setComments((com) => [...com.slice(1, com.length), {
          username: data.userName, 
          text: data.text,
          date: data.date
        }]);
      }
    });

    return () => socket.emit('leave', props.novelId);
  }, [])

  function sendComment(e) {
    e.preventDefault();
    fetch(`/api/novels/comments/${props.novelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        text: userComment
      })
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          alert('You are not logged in');
          document.location.reload();
        }
        throw new Error(res.statusText);
      }
      else return res.json()
    })
    .then(res => {
      console.log(socket);
      socket.emit('comment', {
        room: props.novelId,
        userName: props.userName,
        text: userComment,
        date: res.date
      });
      setUserComment('');
    })
    .catch(err => console.log(err));
  }

  return ( 
    <Container fluid className='main-section__wrapper m-0'>
      <h5 className='section-title'>Comments</h5>
      <DefaultPagination 
        page={currentPage}
        totalPages={Math.ceil(props.commentsCount / 10)}
        handleChangePage={handleCHangePage}/>
      <ListGroup variant='flush' className='mb-2'>
        {
          comments ? 
            comments.map((comment, i) => 
              <Comment username={comment.username} date={comment.date}
                      text={comment.text} key={i}/>)
            : <>Loading...</>
        }
      </ListGroup>
      <DefaultPagination 
        page={currentPage}
        totalPages={Math.ceil(props.commentsCount / 10)}
        handleChangePage={handleCHangePage}/>
      
      {
        props.userName ? (
          <>
            <h5 className='section-title'>Your comment</h5>
            <Form onSubmit={(e) => sendComment(e)}>
              <Form.Group className='mb-2'>
                <Form.Control as="textarea" rows="4" value={userComment} maxLength={300}
                              onChange={(e) => setUserComment(e.target.value)}/>
              </Form.Group>
              <Button className='rounded-0 mb-5' variant="secondary" size='sm' type="submit">
                Send comment
              </Button>
            </Form>
          </>
        ) : <Alert variant='info'>Только зарегистрированные пользователи могут оставлять комментарии. <Link to='/login'>Войдите</Link>, пожалуйста.</Alert>
      }
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    userName: state.user.name
  }
}
 
export default connect(mapStateToProps)(CommentsSection);