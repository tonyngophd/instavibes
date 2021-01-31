import React, { useState, useEffect } from "react";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import {
  BsHeart,
  BsChat,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
} from "react-icons/bs";
import Editor from "draft-js-plugins-editor";
import { EditorState, convertFromRaw } from "draft-js";
import createMentionPlugin from "draft-js-mention-plugin";
import { useHistory, Link } from "react-router-dom";
import CommentInput from "../CommentInput";
import Comment from "../Comment";
import "./post.css";
import { likePost, unlikePost } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";

function Post({ post }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const comments = useSelector(
    (state) => state.posts.homeFeed[post.id].comments
  );
  const [liked, setLiked] = useState(post.likingUsers[user.id]);
  const [likes, setLikes] = useState(Object.values(post.likingUsers).length);
  const [clicks, setClicks] = useState(0);
  const [userMentionPlugin] = useState(
    createMentionPlugin({
      mentionComponent: (mentionProps) => (
        <span
          className={`${mentionProps.className} post-mention`}
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/${mentionProps.mention.name}`);
          }}
        >
          {mentionProps.children}
        </span>
      ),
      theme: {
        mention: "mention",
      },
      mentionPrefix: "@",
    })
  );
  const [hashtagMentionPlugin] = useState(
    createMentionPlugin({
      mentionComponent: (mentionProps) => (
        <span
          className={`${mentionProps.className} post-mention`}
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/explore/tags/${mentionProps.mention.name}/`);
          }}
        >
          {mentionProps.children}
        </span>
      ),
      theme: {
        mention: "mention",
      },
      mentionTrigger: "#",
      mentionPrefix: "#",
    })
  );

  const plugins = [userMentionPlugin, hashtagMentionPlugin];
  let data = JSON.parse(post.captionRawData);
  data = convertFromRaw(data);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(data)
  );

  let createdAt = new Date(post.createdAt);
  let now = Date.now();
  let elapsed = now - createdAt;
  let timestamp;
  if (elapsed < 1000) {
    timestamp = `NOW`;
  } else if (elapsed < 60000) {
    timestamp = `${Math.floor(elapsed / 1000)} SECONDS AGO`;
  } else if (elapsed < 120000) {
    timestamp = `${Math.floor(elapsed / 60000)} MINUTE AGO`;
  } else if (elapsed < 3600000) {
    timestamp = `${Math.floor(elapsed / 60000)} MINUTES AGO`;
  } else if (elapsed < 7200000) {
    timestamp = `${Math.floor(elapsed / 3600000)} HOUR AGO`;
  } else if (elapsed < 86400000) {
    timestamp = `${Math.floor(elapsed / 3600000)} HOURS AGO`;
  } else {
    timestamp = createdAt.toDateString().split(" ").splice(1, 2).join(" ");
  }

  useEffect(() => {
    if (clicks == 2 && !liked) {
      dispatch(likePost(post.id));
      setLiked(true);
      setLikes(likes + 1);
    }
    setTimeout(() => setClicks(0), 300);
  }, [clicks]);

  const likeHandler = () => {
    if (liked) {
      dispatch(unlikePost(post.id));
      setLiked(false);
      setLikes(likes - 1);
    } else {
      dispatch(likePost(post.id));
      setLiked(true);
      setLikes(likes + 1);
    }
  };

  return (
    <div className="feed_post-container">
      <Link to={`/${post.user.username}`}>
        <div className="feed_post-header">
          <img
            src={post.user.profilePicUrl}
            draggable="false"
            alt="user-icon"
          />
          <p className="feed_post-username">{post.user.username}</p>
        </div>
      </Link>

      <div className="feed_post-image">
        <img
          onClick={() => setClicks(clicks + 1)}
          src={
            (post.images[0] && post.images[0].imgUrl) ||
            "https://placeimg.com/500/500"
          }
          draggable="false"
          alt="user-icon"
        />
      </div>
      <div className="feed_post-info">
        <div className="feed_post-info-icons">
          <div className="feed_post-info-icons-left">
            {liked ? (
              <BsHeartFill
                onClick={likeHandler}
                className="post-icon heart-full"
              />
            ) : (
              <BsHeart onClick={likeHandler} className="post-icon" />
            )}
            <BsChat
              onClick={() => history.push(`/p/${post.id}`)}
              className="post-icon-comment"
            />
          </div>
          <div className="feed_post-info-icons-right">
            <BsBookmark className="post-icon-bk" />
          </div>
        </div>
        <div className="feed_post-info-comments">
          <p className="info-likes">
            {likes} {likes === 1 ? "like" : "likes"}
          </p>
          <div className="info-caption">
            <Link to={`/${post.user.username}`}>
              <div className="caption-user">{post.user.username}</div>
            </Link>

            <div className="post-caption">
              <Editor
                editorState={editorState}
                readOnly={true}
                plugins={plugins}
                onChange={(editorState) => setEditorState(editorState)}
              />
            </div>
          </div>

          <div className="post-comments-container">
            {comments &&
              comments.map((comment) => {
                return <Comment home={true} comment={comment} />;
              })}
          </div>
          <Link to={`/p/${post.id}`}>
            <div className="post-timestamp">{timestamp}</div>
          </Link>
          <div className="post-new-comment">
            <CommentInput post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
