require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');
const notification = require('../utils/notifications')

/**
 * Ajout d'un nouveau commentaire
 */
exports.newComment = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
  const postId = req.body.postId;
  const content = req.body.content;

  const sql = "INSERT INTO comments (user_id, post_id, content)\
  VALUES (?, ?, ?);";
  const sqlParams = [userId, postId, content];

  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      notification.addComment(userId, postId)
        .then(notification.addAnswer(userId, postId))
        .then(data => {
          res.status(201).json({ message: 'Commentaire ajoutée' });
        })
        .catch(err => {
          res.status(500).json({ "error": err });
        })
    }
  });
  connection.end();
}

/**
 * Récupérer tous les commentaires d'un post particulier
 */
exports.getCommentsofPost = (req, res, next) => {
  const connection = database.connect();

  const postId = req.body.postId;

  const sql = "SELECT comments.id AS commentId, comments.publication_date AS commentDate, comments.content As commentContent, users.id AS userId, users.name AS userName, users.pictureurl AS userPicture\
  FROM comments\
  INNER JOIN users ON comments.user_id = users.id\
  WHERE comments.post_id = ?";
  const sqlParams = [postId];

  connection.execute(sql, sqlParams, (error, comments, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(200).json({ comments });
    }
  });

  connection.end();
}

/**
 * Suppression d'un commentaire
 */
exports.deleteComment = (req, res, next) => {
  const connection = database.connect();
  const commentId = parseInt(req.params.id, 10);
  const sql = "DELETE FROM comments WHERE id=?;";
  const sqlParams = [commentId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Commentaire supprimée' });
    }
  });
  connection.end();
}
