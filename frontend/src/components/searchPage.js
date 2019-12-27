import React, { useState, useEffect } from 'react'
import NovelPreviewWide from './novelPreviewWide'
import Container from 'react-bootstrap/Container';

const SearchPage = (props) => {

  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = props.match.params.username;
    const genre = props.match.params.genre;
    let fetchLink ='';
    if (username)
      fetchLink = `/api/novels/userNovels/${username}`
    else
      fetchLink = `/api/novels/searchGenre/${genre}`
    fetch(fetchLink)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json();
    })
    .then(res => {
      setNovels(res)
      setLoading(false)
    })
    .catch(err => console.log(err));
  }, []);

  if (loading) return (<>Loading...</>)

  return (
    <Container className='main-section__wrapper'>
      {novels.length === 0 ? 'No such novels' : ''}
      {
        novels.map((novel, i) => (
          <NovelPreviewWide key={i} novel={novel} />
        ))
      }
    </Container>
  )
}

export default SearchPage;