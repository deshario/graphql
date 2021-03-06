import Post from './post.model'
import uploadFile from '../../../config/file'

const calculateSkip = (page, size) => (page - 1) * size;

const calculateTotalPages = (count, size) => Math.ceil(count / size);

interface PostArgs {
  content?: string
  attachment?: string
  creator?: string
}

const postController = {
  getPosts: async(args, context = {}) => {
    return await Post.find(args.where).sort(args.sort || {createdAt: -1}).skip(args.skip || 0).limit(args.limit || false).populate("creator");
  },
  getPaginatedPosts: async(args, context = {}) => {
    const { page, size } = args
    const mPage = page || 1
    const mSize = size || 25
    const [posts, totalPosts] = await Promise.all([
      Post.find(args.where).populate("creator").skip(calculateSkip(mPage, mSize)).limit(mSize).exec(),
      Post.countDocuments().exec(),
    ]);
    return {
      pagination:{
        currentPage: parseInt(mPage),
        totalPages: calculateTotalPages(totalPosts, mSize),
        itemsPerPage: posts.length,
        totalItems: totalPosts
      },
      posts
    }
  },
  createPost: async (args:PostArgs, context={}) => {
    const { content, attachment, creator } = args
    const newPost = new Post({ content, creator });
    if(attachment){
      const uploadedFile = await uploadFile({ attachment });
      newPost.attachment = uploadedFile.fileName;
    }
    const post = await newPost.save();
    const populatedPost = await post.populate('creator').execPopulate();
    return populatedPost;
  },
  updatePost: async(args, context={}) => {
    const updateObj = JSON.parse(JSON.stringify(args));
    delete updateObj._id
    const updatedPost = await Post.findByIdAndUpdate({ _id:args._id }, updateObj, {new: true});
    return updatedPost;
  },
  deletePost: async(args, context={}) => {
   return await Post.findOneAndDelete({_id: args._id});
  }
}

export { postController }