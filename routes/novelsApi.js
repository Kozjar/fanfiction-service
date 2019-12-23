const router = require('express').Router();
const Novel = require('../models/novel');
const Genre = require('../models/genres');

router.get('/lastUpdated', (req, res) => {
  Novel.find({}, {title: 1, total_rate: 1, genres: 1})
  .sort({last_update: 1})
  .limit(6)
  .then(novels => {
    res.send(novels);
  })
  .catch(err => console.log(err));
})

router.get('/topRated', (req, res) => {
  Novel.find({}, {title: 1, total_rate: 1, genres: 1})
  .sort({total_rate: -1})
  .limit(6)
  .then(novels => {
    res.send(novels);
  })
  .catch(err => console.log(err));
})

router.post('/', (req, res) => {
  console.log('get request from frontend');
  console.log(req.body);
  Novel.findOne({title: req.body.title})
  .then(novel => {
    if (novel) res.status(405).send('Novel with such title already exist');
    else {
      new Novel({
        title: req.body.title,
        author_name: req.body.authorName,
        description: req.body.description,
        chapters: [...req.body.chapters],
        comments: [],
        genres: [...req.body.genres],
        last_update: new Date(),
        upload_date: new Date(),
        total_rate: 0,
        user_rate: []
      }).save();
    }
  })
  .then(novel => res.send(novel._id))
  .catch(err => res.status(404).send());
})

router.get('/:id', (req, res) => {
  Novel.findById(req.params.id)
  .then(novel => {
    let tmpNovel = novel;
    tmpNovel.chapters = novel.chapters.map(o => {
      return {
        name: o.name,
        id: o._id
      }
    });
    const userRate = novel.user_rate.id(req.session.userId) || {rate: 0};
    res.send({
      novel: {...tmpNovel._doc, rate_count: tmpNovel.user_rate.length}, 
      userRate: userRate.rate
    });
  })
  .catch(err => {
    console.log(err);
    res.status(404).send()
  });
})

router.put('/rate', (req, res) => {
  Novel.findById(req.body.novelId)
  .then(novel => {
    if (novel.user_rate.id(req.session.userId)) {
      novel.user_rate.id(req.session.userId).rate = req.body.rate;
    } else {
      novel.user_rate.push({_id: req.session.userId, rate: req.body.rate});
    }
    novel.total_rate = novel.user_rate.toObject().reduce((res, o) => res + o.rate, 0) / novel.user_rate.length;
    return novel.save();
  })
  .then(novel => res.send({
    total_rate: novel.total_rate,
    rate_count: novel.user_rate.length
  }))
  .catch(err => {
    console.log(err);
    res.status(404).send()
  })
})

router.get('/genres/:lang', (req, res) => {
  if (req.params.lang === 'ru') {
    Genre.find({}, {ru: 1})
    .then(genres => {
      res.send(genres.map(o => o.ru));
    })
    .catch(err => console.log(err));
  }
  if (req.params.lang === 'en') {
    Genre.find({}, {en: 1})
    .then(genres => {
      res.send(genres.map(o => o.en));
    })
    .catch(err => console.log(err));
  }
})

module.exports = router;