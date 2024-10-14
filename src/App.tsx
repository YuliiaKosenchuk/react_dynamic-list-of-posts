/* eslint-disable @typescript-eslint/indent */

import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import {
  addNewComment,
  deleteComment,
  getUserPostComments,
  getUserPosts,
  getUsers,
} from './api/post';
import { Post } from './types/Post';
import { Comment, CommentData } from './types/Comment';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userSelected, setUserSelected] = useState<User | null>(null);
  const [showPostLoader, setShowPostLoader] = useState<boolean>(false);
  const [showCommentLoader, setShowCommentLoader] = useState<boolean>(false);
  const [buttonAddLoading, setButtonAddLoading] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showSideBar, setShowSideBar] = useState<number | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [errorsPost, setErrorsPost] = useState<boolean>(false);
  const [errorsComment, setErrorsComment] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    getUsers().then(res => {
      setUsers(res as User[]);
    });
  }, []);

  const handleUserPosts = (user: User) => {
    setShowPostLoader(true);
    getUserPosts(user.id)
      .then(res => {
        setUserPosts(res as Post[]);
        setErrorsPost(false);
      })
      .catch(() => {
        setErrorsPost(true);
      })
      .finally(() => {
        setShowPostLoader(false);
      });
  };

  const handleShowComment = (currentPost: Post) => {
    setShowSideBar(currentPost.id);
    setShowCommentLoader(true);

    setSelectedPost(currentPost);

    getUserPostComments(currentPost.id)
      .then(res => {
        setPostComments(res as Comment[]);
        setErrorsComment(false);
      })
      .catch(() => {
        setErrorsComment(true);
      })
      .finally(() => {
        setShowCommentLoader(false);
      });
  };

  const handleDeleteComment = (commentId: number) => {
    deleteComment(commentId).then(() => {
      setPostComments(prevPostComments =>
        prevPostComments.filter((comment: Comment) => comment.id !== commentId),
      );
    });
  };

  const addComment = (newComment: CommentData) => {
    setButtonAddLoading(true);
    addNewComment(newComment).then(res => {
      setPostComments([...postComments, res as Comment]);
      setButtonAddLoading(false);
    });
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  setUserSelected={setUserSelected}
                  userSelected={userSelected}
                  handleUserPosts={handleUserPosts}
                  setShowSideBar={setShowSideBar}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!userSelected && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {showPostLoader && <Loader />}

                {errorsPost && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {userPosts.length > 0 && !showPostLoader && (
                  <PostsList
                    userPosts={userPosts}
                    handleShowComment={handleShowComment}
                    showSideBar={showSideBar}
                    setShowSideBar={setShowSideBar}
                    setShowCommentForm={setShowCommentForm}
                  />
                )}
                {userSelected &&
                  userPosts.length === 0 &&
                  !showPostLoader &&
                  !errorsPost && (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': showSideBar },
            )}
          >
            <div className="tile is-child box is-success ">
              <PostDetails
                showCommentLoader={showCommentLoader}
                postComments={postComments}
                selectedPost={selectedPost}
                errorsComment={errorsComment}
                handleDeleteComment={handleDeleteComment}
                addComment={addComment}
                buttonAddLoading={buttonAddLoading}
                setShowCommentForm={setShowCommentForm}
                showCommentForm={showCommentForm}
                userSelected={userSelected}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
