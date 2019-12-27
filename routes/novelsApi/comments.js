const router = require('express').Router();
const Novel = require('../../models/novel');
const { ObjectId } = require('mongoose').Types;
const { checkIsLoggedIn } = require('../loginCheck')

router.post('/:novelId', checkIsLoggedIn, (req, res) => {
  if (!req.isLoggedIn) {
    res.status(401).send();
    return
  }
  const userComment = {
    user_id: ObjectId(req.session.userId),
    text: req.body.text,
    date: new Date()
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

router.get('/:novelId/:page', (req, res) => {
  const id = req.params.novelId;
  const limit = 10;
  const skip = limit * req.params.page;
  Novel.aggregate([
    { $match: { _id: ObjectId(id) } },
    { $project: { comments: 1 } },
    { $unwind: "$comments" },
    { $replaceRoot: {newRoot: '$comments'} },
    { $sort: { date: -1 } },
    { $skip: skip },
    { $limit: limit },
    { $lookup: {
      from: 'users',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user'
    } },
    { $replaceRoot: { newRoot: {
      text: '$text',
      username: '$user.username',
      date: '$date'
    }} },
    { $unwind: '$username' },
    { $sort: { date: 1 } }
  ])
  .then(comments => {
    res.send(comments);
  })
})

module.exports = router;