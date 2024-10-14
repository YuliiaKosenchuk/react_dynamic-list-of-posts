import React, { useEffect } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Comment, CommentData } from '../types/Comment';
import { Post } from '../types/Post';
import { User } from '../types/User';

type Props = {
  showCommentLoader: boolean;
  postComments: Comment[];
  selectedPost: Post | null;
  errorsComment: boolean;
  handleDeleteComment: (commentId: number) => void;
  addComment: (newComment: CommentData) => void;
  buttonAddLoading: boolean;
  setShowCommentForm: (item: boolean) => void;
  showCommentForm: boolean;
  userSelected: User | null;
};

export const PostDetails: React.FC<Props> = ({
  showCommentLoader,
  postComments,
  selectedPost,
  errorsComment,
  handleDeleteComment,
  addComment,
  buttonAddLoading,
  setShowCommentForm,
  showCommentForm,
  userSelected,
}) => {
  useEffect(() => {
    setShowCommentForm(false);
  }, [selectedPost]);

  if (!selectedPost || userSelected?.id !== selectedPost.userId) {
    return null;
  }

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">{`#${selectedPost?.id}: ${selectedPost?.title}`}</h2>

          <p data-cy="PostBody">{selectedPost?.body}</p>
        </div>

        <div className="block">
          {showCommentLoader ? (
            <Loader />
          ) : (
            <>
              {errorsComment ? (
                <div className="notification is-danger" data-cy="CommentsError">
                  Something went wrong
                </div>
              ) : (
                <>
                  {postComments.length === 0 ? (
                    <p className="title is-4" data-cy="NoCommentsMessage">
                      No comments yet
                    </p>
                  ) : (
                    <p className="title is-4">Comments:</p>
                  )}

                  {postComments.map((comment: Comment) => (
                    <article
                      className="message is-small"
                      data-cy="Comment"
                      key={comment.id}
                    >
                      <div className="message-header">
                        <a
                          href={`mailto:${comment.email}`}
                          data-cy="CommentAuthor"
                        >
                          {comment.name}
                        </a>
                        <button
                          data-cy="CommentDelete"
                          type="button"
                          className="delete is-small"
                          aria-label="delete"
                          onClick={() => handleDeleteComment(comment.id)}
                        ></button>
                      </div>

                      <div className="message-body" data-cy="CommentBody">
                        {comment.body}
                      </div>
                    </article>
                  ))}

                  {!showCommentForm && (
                    <button
                      data-cy="WriteCommentButton"
                      type="button"
                      className="button is-link"
                      onClick={() => setShowCommentForm(true)}
                    >
                      Write a comment
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
        {showCommentForm && (
          <NewCommentForm
            addComment={addComment}
            buttonAddLoading={buttonAddLoading}
            selectedPost={selectedPost}
          />
        )}
      </div>
    </div>
  );
};
