const router = require('express').Router();
const Novel = require('../models/novel');
const Genre = require('../models/genres');
const User = require('../models/user');

const checkIsLoggedIn = (req, res, next) => {
  req.isLoggedIn = true;
  User.findById(req.session.userId)
  .then(user => {
    if (user) next();
    else {
      req.isLoggedIn = false;
      next();
    }
  })
  .catch(err => console.log(`checkIsLoggedIn error: ${err}`))
}

const checkIsLoggedInStrict = (req, res, next) => {
  req.isLoggedIn = true;
  User.findById(req.session.userId)
  .then(user => {
    if (user) next();
    else {
      res.status(401).send();
    }
  })
  .catch(err => console.log(err))
}

router.get('/lastUpdated', (req, res) => {
  Novel.find({}, {title: 1, total_rate: 1, genres: 1})
  .sort({last_update: -1})
  .limit(10)
  .then(novels => {
    res.send(novels);
  })
  .catch(err => console.log(err));
})

router.get('/topRated', (req, res) => {
  Novel.find({}, {title: 1, total_rate: 1, genres: 1})
  .sort({total_rate: -1})
  .limit(10)
  .then(novels => {
    res.send(novels);
  })
  .catch(err => console.log(err));
})

// Save new novel
router.post('/', checkIsLoggedInStrict, (req, res) => {
    Novel.findOne({title: req.body.title})
    .then(novel => {
      if (novel) {
        res.status(405).send('Novel with such title already exist');
        throw new Error('Novel with such title already exist');
      }
      else {
        return new Novel({
          title: req.body.title,
          author_id: req.session.userId,
          description: req.body.description,
          chapters: [...req.body.chapters],
          comments: [],
          genres: [...req.body.genres],
          last_update: new Date(),
          upload_date: new Date(),
          total_rate: 0,
          user_rate: []
        })
        .save()
      }
    })
    .then(novel => res.send(novel._id))
    .catch(err => {
      console.log(err);
    });
})

// Update existing novel
router.post('/:id', checkIsLoggedInStrict, (req, res) => {
  Novel.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      author_id: req.session.userId,
      description: req.body.description,
      chapters: [...req.body.chapters],
      genres: [...req.body.genres],
      last_update: new Date(),
    }
  })
  .then(novel => res.send(novel._id))
  .catch(err => {
    console.log(err);
    res.status(404).send();
  });
});

// get full novel info by id
router.get('/:id', checkIsLoggedIn, (req, res) => {
  let status = req.isLoggedIn;
  Novel.findById(req.params.id)
  .then(novel => {
    if (req.session.userId == novel.author_id) status = 2;
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
      userRate: userRate.rate,
      accessStatus: status
    });
  })
  .catch(err => {
    console.log(err);
    res.status(404).send();
  });
})

router.get('/forEdit/:id', checkIsLoggedIn, (req, res) => {
  Novel.findById(req.params.id, {
    genres: 1, 
    description: 1,
    title: 1,
    chapters: 1
  })
  .then(novel => {
    res.send(novel);
  })
  .catch(err => {
    console.log(err);
    res.status(404).send()
  });
})

router.get('/:id/chapter/:chapterId', (req, res) => {
  Novel.findById(req.params.id, {chapters: 1, title: 1})
  .then(novel => {
    tmpChapters = novel.chapters.map(o => {
      return {
        name: o.name
      }
    });
    console.log();
    res.send({
      chapters: tmpChapters,
      title: novel.title,
      activeChapter: novel.chapters[req.params.chapterId]
    })
  })
  .catch(err => {
    console.log(err);
    res.status(404).send();
  })
})

router.put('/rate', checkIsLoggedIn, (req, res) => {
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
    res.status(500).send()
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

router.get('/searchGenre/:genre', (req, res) => {
  Novel.find({genres: {$in: [Number.parseInt(req.params.genre)]}}, 
    {title: 1, description: 1, _id: 1})
  .then(novels => {
    res.send(novels);
  })
  .catch(err => {
    console.log(err);
    res.status(404).send()
  })
});

router.get('/userNovels/:username', (req, res) => {
  User.findOne({username: req.params.username}, {_id: 1})
  .then(user =>
    Novel.find({author_id: user._id}, {title: 1, description: 1, _id: 1}))
  .then(novels => {
    res.send(novels);
  })
  .catch(err => {
    console.log(err);
    res.status(404).send();
  })
});

router.get('searchByName/:name', (req, res) => {
  const regexp = new RegExp(req.params.name);
  Novel.find({title: regexp})
  .then(novels => console.log(novels));
});

router.post('/:novelId/comments', checkIsLoggedIn, (req, res) => {
  if (!req.isLoggedIn) {
    res.status(401).send();
    return
  }
  const userComment = {
    user_id: req.session.userId,
    text: req.body.text
  }
  Novel.findById(req.params.novelId)
  .then(novel => {
    novel.comments.push(userComment);
    return novel.save();
  })
  .then(() => res.send({...userComment}))
  .catch(err => {
    res.status(500).send();
    console.log(`err!!: ${err}`);
  })
});

module.exports = router;