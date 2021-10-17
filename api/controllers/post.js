require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');

/**
 * Ajout d'une nouvelle publication
 */
exports.newPost = (req, res, next) => {
  console.log("hello from new post backend");
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
  const picture = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
  const description = req.body.description ? req.body.description : null;
  const privacy = req.body.privacy ? req.body.privacy : "pb";

  console.log(picture,description,privacy);
  const sql = "INSERT INTO Posts (user_id, picture, description, privacy)\
  VALUES (?, ?, ?, ?);";
  const sqlParams = [userId, picture, description, privacy];

  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Publication ajoutée' });
    }
  });

  connection.end();
}


/**
 * Récupération de tous les posts, avec commentaires et likes/dislikes
 */
// Fonction utilitaire : Récupérer les commentaires des posts
// posts est un ARRAY de posts (sans commentaires)
// connection : est la connection déjà ouverte précédemment
exports.getCommentsOfEachPosts = (posts, connection) => {
  return Promise.all(posts.map(post => {
    const sql = "SELECT Comments.id AS commentId, Comments.comment_date AS commentDate, Comments.content As commentContent, Users.id AS userId, Users.name AS userName, Users.picture AS userPicture\
                FROM Comments\
                INNER JOIN Users ON Comments.user_id = Users.id\
                WHERE Comments.post_id = ?";
    const sqlParams = [post.postId];
    return new Promise((resolve, reject) => {
      connection.execute(sql, sqlParams, (error, comments, fields) => {
        if (error) {
          reject(error);
        } else {

          resolve({ ...post, comments });
        }
      });
    })
  }));
}

exports.setIsFriend = (post, connection,currentUserId) => {

    const sql= "SELECT COUNT(*) AS isFriend FROM `friends` WHERE (`id_user1` = ? AND id_user2 = ?) OR (`id_user2` =? AND id_user1 = ?)";
    const sqlParams = [currentUserId, post.userId, post.userId, currentUserId];
    console.log("Current user :",currentUserId);
    console.log("Post user :",post.userId);

    return new Promise((resolve, reject) => {
      connection.execute(sql, sqlParams, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          //post.isFriend = results[0].isFriend
          console.log("Is friend :",results[0].isFriend);
          resolve({ ...post,isFriend : results[0].isFriend});
        }
      });
    });
}

// Fonction utilitaire : Récupérer les like/dislikes des posts
// posts est un ARRAY de posts (sans like/dislikes)
// connection : est la connection déjà ouverte précédemment
exports.getLikesOfEachPosts = (posts, userId, connection) => {
  return Promise.all(posts.map(post => {
    const postId = post.postId;
    const sql = "SELECT\
                (SELECT COUNT(*) FROM Likes WHERE (post_id=? )) AS LikesNumber,\
                (SELECT COUNT(*) FROM Likes WHERE (post_id=? )) AS DislikesNumber,\
                (SELECT COUNT(*) FROM Likes WHERE (post_id=? AND user_id=?)) AS currentUserReaction";
    const sqlParams = [postId, postId, postId, userId];
    return new Promise((resolve, reject) => {
      connection.execute(sql, sqlParams, (error, result, fields) => {
        if (error) {
          reject(error);
        } else {
          /*const conn2 = database.connect();

          const sql2= "SELECT COUNT(*) AS isFriend FROM `friends` WHERE (`id_user1` = ? AND id_user2 = ?) OR (`id_user2` =? AND id_user1 = ?)";
          const sqlParams2 = [userId, post.userId, post.userId, userId];

          conn2.execute(sql2, sqlParams2, (error2, result2, fields2) => {
            if (error) {
              reject(error);
            } else {
              //post.isFriend = result2[0].isFriend;
              console.log(result2 )
              resolve({ ...post, likes: result[0] });
            }
          })*/
          resolve({ ...post, likes: result[0] });
        }
      });
    })
  }));
}

// Récupération de tous les posts, avec commentaires et likes/dislikes
exports.getAllPosts = (req, res, next) => {
  const connection = database.connect();
  // 1: récupération de tous les posts
  const sql = "SELECT Posts.id AS postId, Posts.post_date AS postDate, Posts.picture AS postImage, Posts.description as postContent, Users.id AS userId, Users.name AS userName, Users.picture AS userPicture\
  FROM Posts\
  INNER JOIN Users ON Posts.user_id = Users.id\
  ORDER BY postDate DESC";
  connection.execute(sql, (error, rawPosts, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      // 2: Pour chaque post, on va chercher tous les commentaires du post
      this.getCommentsOfEachPosts(rawPosts, connection)
        .then(postsWithoutLikes => {
          // 3: Pour chaque post, on rajoute les likes/dislikes
          const cryptedCookie = new Cookies(req, res).get('snToken');
          const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
          this.getLikesOfEachPosts(postsWithoutLikes, userId, connection)
            .then(posts => {
              res.status(200).json({ posts });
            })
            .catch(err => {
              res.status(500).json({ "error": "Un problème est survenu 1" });
            })
        })
        .catch(err => {
          res.status(500).json({ "error": "Un problème est survenu" });
        })
    }
  });
}

/**
 * Récupération de plusieurs posts (avec limit et offset)
 */
exports.getSomePosts = (req, res, next) => {
  const connection = database.connect();
  const connection2 = database.connect();
  // 1: récupération des posts recherchés
  const limit = parseInt(req.params.limit);
  const offset = parseInt(req.params.offset);
  const sql = "SELECT Posts.id AS postId, Posts.post_date AS postDate, Posts.picture AS postImage, Posts.description as postContent, Posts.privacy AS postPrivacy, Users.id AS userId, Users.name AS userName, Users.picture AS userPicture\
  FROM Posts\
  INNER JOIN Users ON Posts.user_id = Users.id\
  ORDER BY postDate DESC\
  LIMIT ? OFFSET ?;";
  const sqlParams = [limit, offset];


  connection.execute(sql, sqlParams, (error, rawPosts, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ "error": error.sqlMessage });
    } else {
        // 3: Pour chaque post, on rajoute les likes/dislikes
        // 2: Pour chaque post, on va chercher tous les commentaires du post
        this.getCommentsOfEachPosts(rawPosts, connection)
            .then(postsWithoutLikes => {
              // 3: Pour chaque post, on rajoute les likes/dislikes
              const cryptedCookie = new Cookies(req, res).get('snToken');
              const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
              this.getLikesOfEachPosts(postsWithoutLikes, userId, connection)
                  .then(posts => {
                    res.status(200).json({ posts });
                  })
            })

    }
  });
}

exports.getOnePost = (req, res, next) => {
  const connection = database.connect();
  // 1: récupération des posts recherchés
  const postId = parseInt(req.params.id);
  const sql = "SELECT Posts.id AS postId, Posts.post_date AS postDate, Posts.picture AS postImage, Posts.description as postContent, Users.id AS userId, Users.name AS userName, Users.picture AS userPicture\
  FROM Posts\
  INNER JOIN Users ON Posts.user_id = Users.id\
  WHERE Posts.id = ?\
  ORDER BY postDate DESC";
  const sqlParams = [postId];
  connection.execute(sql, sqlParams, (error, rawPosts, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      // 2: on va chercher tous les commentaires du post
      this.getCommentsOfEachPosts(rawPosts, connection)
        .then(postsWithoutLikes => {
          // 3: Pour chaque post, on rajoute les likes/dislikes
          const cryptedCookie = new Cookies(req, res).get('snToken');
          const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
          this.getLikesOfEachPosts(postsWithoutLikes, userId, connection)
            .then(post => {
              res.status(200).json({ post });
            })
        })
    }
  });
}




/**
 * Suppression d'un post
 */
exports.deletePost = (req, res, next) => {
  const connection = database.connect();
  const postId = parseInt(req.params.id, 10);
  const sql = "DELETE FROM Posts WHERE id=?;";
  const sqlParams = [postId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Publication supprimée' });
    }
  });
  connection.end();
}
