const router = require('express').Router();
const Novel = require('../models/novel');
const Genre = require('../models/genres');

router.get('/lastUpdated', (req, res) => {
  Novel.find({})
  .sort({last_update: 1})
  .limit(6)
  .then(novels => {
    const novelsPrev = novels.map(novel => {
      return {
        title: novel.title,
        total_rate: novel.total_rate,
        genres: [...novel.genres]
      }
    });
    res.send(novelsPrev);
  })
  .catch(err => console.log(err));
})

router.get('/topRated', (req, res) => {
  Novel.find({})
  .sort({total_rate: 1})
  .limit(6)
  .then(novels => {
    const novelsPrev = novels.map(novel => {
      return {
        title: novel.title,
        total_rate: novel.total_rate,
        genres: [...novel.genres]
      }
    });
    res.send(novelsPrev);
  })
  .catch(err => console.log(err));
})

router.post('/new', (req, res) => {
  Novel.findOne({title: req.body.title})
  .then(novel => {
    if (novel) res.status(405).send('Novel with such title already exist');
    else {
      new Novel({
        title: req.body.title,
        author_name: req.body.author_name,
        description: req.body.description,
        chapters: [...req.body.chapters],
        comments: [],
        genres: [...req.body.genres],
        last_update: new Date(),
        total_rate: 0,
        rate_count: 0
      }).save();
    }
  })
  .then(novel => res.send(novel))
  .catch(err => res.status(404).send());
})

router.get('/:title', (req, res) => {
  Novel.findOne({title: req.params.title})
  .then(novel => {
    const tmpNovel = novel;
    tmpNovel.chapters = novel.chapters.map(o => o.name);
    res.send(tmpNovel);
  })
  .catch(err => res.status(404).send());
})

router.get('/genres', (req, res) => {
  Genre.find({})
  .then(genres => {
    res.send(genres);
  })
  .catch(err => console.log(err));
})

module.exports = router;