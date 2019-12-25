import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';

import openSocket from 'socket.io-client';

let socket = undefined;

const Comment = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(props.userName);

  useEffect(() => {
    if (userName) return setIsLoading(false);
    fetch(`/api/users/getUsername/${props.userId}`)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      else return res.text();
    })
    .then(userName => {
      setUserName(userName);
      setIsLoading(false);
    })
    .catch(err => console.log(err));
  }, []) 

  if (isLoading) return (<></>)

  return (
    <div>
      <p><strong>{userName}:</strong></p>
      <pre>{props.text}</pre>
    </div>
  )
}

const CommentsSection = (props) => {
  const [userComment, setUserComment] = useState('');
  const [comments, setComments] = useState([...props.initComments]);

  useEffect(() => {
    socket = openSocket();

    socket.on('connect', data => {
      console.log(`emit on(connect), data: ${data}`);
      socket.emit('join', props.novelId);
    });

    socket.on('newComment', data => {
      console.log(`receive a comment: `);
      console.log(data);
      console.log(comments);
      setComments((com) => [...com, {userName: data.userName, text: data.text}]);
    });

    return () => socket.emit('leave', props.novelId);
  }, [])

  function sendComment(e) {
    e.preventDefault();
    fetch(`/api/novels/${props.novelId}/comments`, {
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
        text: userComment
      });
      setUserComment('');
    })
    .catch(err => console.log(err));
  }

  return ( 
    <div>
      {comments.map((comment, i) => 
        <Comment userName={comment.userName} userId={comment.user_id} 
                 text={comment.text} key={i}/>
      )}
      {
        props.userName ? (
          <Form onSubmit={(e) => sendComment(e)}>
            <Form.Group>
              <Form.Label>Your comment</Form.Label>
              <Form.Control as="textarea" rows="4" value={userComment} 
                            onChange={(e) => setUserComment(e.target.value)}/>
            </Form.Group>
            <Button type="submit">
              Send comment
            </Button>
          </Form>
        ) : <>You should be logged in to leave the comments</>
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userName: state.user.name
  }
}
 
export default connect(mapStateToProps)(CommentsSection);