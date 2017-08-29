
module.exports = {
	

  create: function (req, res) {
    let categoryName = req.param('category_name');
    // param model Post

    let title   =  req.param('title');
    let content =  req.param('content');
    let userId  =  req.param('user_id');

    if (!categoryName) {
      return res.badRequest({err: 'Invalid Category Name'});
    } 

    if (!title) {
      return res.badRequest({err: 'Invalid Title'});
    } 

    if (!content) {
      return res.badRequest({err: 'Invalid Content'});
    } 

    if (!userId) {
      return res.badRequest({err: 'Invalid User Id'});
    }  

    
    Category.create({
      name: categoryName
    }).exec( (err, category) => {
      
      if (err){
        return res.serverError(err);
      }

      // Create new post
      Post.create({
        title,
        content,
        _user: userId,
        _category: category.id
      }).exec( (err, post) => {
          if (err){
            return res.serverError(err);
          }
         
         return res.ok({post, category});
      });
      

    });
  },


  findOne: function (req, res) {
    //extract postId
    let postId = req.params.id;

    //validate postId
    if(!postId){
      return res.badRequest({err : 'invalid post_id'});
    }

    //find single post with category
    Post.findOne({
      id : postId
    }).populate('_category')
      .then(post => {
          res.ok(post);
      }).catch(err => res.notFound(err));
  },


  findAll: function (req, res) {

    Post.find()
      .populate('_category')
      .then(posts => {

        if(!posts || posts.length ===0){
          throw new Error('No post found');
        }
        return res.ok(posts);
      })
      .catch(err => res.notFound(err));
  },


  update: function (req, res) {
    //Extract PostId
    let postId = req.params.id;

    let post = {};

    //extract title
    let title = req.param('title'),
       content = req.param('content'),
       userId = req.param('user_id'),
       categoryId = req.param('category_id');

    //add title to Post object
    if(title){
      post.title = title;
    }
    //add content to Post Object
    if(content){
      post.content = content;
    }
    if(userId){
      post._user = userId;
    }
    if(categoryId){
      post._category = categoryId;
    }

    //Update the Post by id

     Post.update({id : postId},post)
       .then(post => {

         return res.ok(post[0]);
       })
       .catch(err => res.serverError(err));
  },


  delete: function (req, res) {
    //extract postId
    let postId = req.params.id;

    //validate postId
    if(!postId){
      return res.badRequest({err : 'invalid post_id'});
    }


    //delete the Post
    Post.destroy({
      id : postId
    })
      .then(post => {

        res.ok(`Post has been deleted with ID ${postId}`);

      })
  }
};

