import React from 'react'
import Media from "react-bootstrap/Media";
import { Link } from 'react-router-dom';

const NovelPreviewWide = (props) => {

  return ( 
    <Media  className='mb-5'>
      <img
        alt='novel'
        className="mr-3" 
        width={150}
        height={200}/>
      <Media.Body>
        <Link to={`/novel/${props.novel._id}`}><h5>{props.novel.title}</h5></Link>
        <p>{props.novel.description}</p>
      </Media.Body>
    </Media>
   );
}
 
export default NovelPreviewWide;