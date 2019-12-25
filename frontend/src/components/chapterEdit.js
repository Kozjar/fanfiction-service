import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import { Remarkable } from 'remarkable';

import upArrow from '../img/up-arrow.png'
import downArrow from '../img/down-arrow.png'
import editBtn from '../img/edit-btn.png'
import deleteBtn from '../img/delete.png'

const ChapterEdit = (props) => {

  const [chapterEditing, setchapterEditing] = useState({show: false});
  const [editorState, setEditorState] = useState('');
  const [editorTab, setEditorTab] = useState('editor');
  const [editorPreview, setEditorPreview] = useState('');

  const deleteChapter = i => {
    const tmpCh = props.chapters;
    tmpCh.splice(i, 1);
    props.setChapters([...tmpCh]);
  }

  const upChapter = i => {
    if (i !== 0) {
      const tmpCh = props.chapters;
      [tmpCh[i-1], tmpCh[i]] = [tmpCh[i], tmpCh[i-1]];
      props.setChapters([...tmpCh]);
    }
  }

  const downChapter = i => {
    if (i !== props.chapters.length - 1) {
      const tmpCh = props.chapters;
      [tmpCh[i+1], tmpCh[i]] = [tmpCh[i], tmpCh[i+1]];
      props.setChapters([...tmpCh]);
    }
  }

  const handleChapterChange = (e, i) => {
    const tmpCh = props.chapters;
    tmpCh[i].name = e.target.value;
    props.setChapters([...tmpCh]);
  }

  const openPageEditor = i => {
    setEditorState(props.chapters[i].text);
    setchapterEditing({show: true, id: i});
  }

  const saveChapterText = () => {
    setchapterEditing({show: false});
    const tmpCh = props.chapters;
    tmpCh[chapterEditing.id].text = editorState;
    props.setChapters(tmpCh);
  }

  const changeEditorTab = tab => {
    if (tab === 'editor') setEditorPreview('');
    if (tab === 'preview') setEditorPreview(md.render(editorState))
    setEditorTab(tab);
  }

  const md = new Remarkable();

  return (
    <>
      <ListGroup>
        {
          props.chapters.map((chapter, i) =>  
            <InputGroup className='chapter__input rounded-0' key={i}>
              <InputGroup.Prepend>
                <InputGroup.Text>{`Chapter - ${i+1}`}</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                placeholder="Enter chapter name"
                aria-label="Chapter name"
                value={chapter.name}
                onChange={(e) => handleChapterChange(e, i)}
              />
              <InputGroup.Append>
                <Button className='p-0' variant="outline-secondary" onClick={() => upChapter(i)}>
                  <img src={upArrow} alt="up-arrow"/>
                </Button>
                <Button className='p-0' variant="outline-secondary" onClick={() => downChapter(i)}>
                  <img src={downArrow} alt="down-arrow"/>
                </Button>
                <Button className='p-0' variant="outline-secondary" onClick={() => openPageEditor(i)}>
                  <img src={editBtn} alt="edit-btn"/>
                </Button>
                <Button className='p-0' variant="outline-secondary" onClick={deleteChapter.bind(this, i)}>
                  <img src={deleteBtn} alt="delete-btn"/>
                </Button>
              </InputGroup.Append>
            </InputGroup>
        )}
        <Button variant='light' className='rounded-0' block
                onClick={() => props.setChapters([...props.chapters, {name: '', text: ''}])}>
          Add new chapter +
        </Button>
      </ListGroup>

      <Modal
        show={chapterEditing.show}
        onHide={() => setchapterEditing({show: false})}
        dialogClassName="modal-xl h-90"
        aria-labelledby="chapter-editing">
        
        <Modal.Header closeButton>
          <Modal.Title id="chapter-editing">
            Chapter {chapterEditing.id + 1} - {chapterEditing.show ? props.chapters[chapterEditing.id].name : ' '}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='h-100'>
          <Tabs activeKey={editorTab} onSelect={k => changeEditorTab(k)}>
            <Tab eventKey="editor" title="Edit file">
              <Form.Control as="textarea" value={editorState}
                onChange={(e) => setEditorState(e.target.value)}/>
            </Tab>
            <Tab eventKey="preview" title="Preview changes">
              <div className='preview__text overflow-auto' dangerouslySetInnerHTML={{__html: editorPreview}}>
              </div>
            </Tab>
          </Tabs>
            

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setchapterEditing({show: false})}>
            Close
          </Button>
          <Button variant="primary" onClick={() => saveChapterText()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ChapterEdit;