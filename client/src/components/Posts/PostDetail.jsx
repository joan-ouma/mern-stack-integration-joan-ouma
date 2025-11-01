import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await postsAPI.getPost(id);
            setPost(response.data);
        } catch (err) {
            setError('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postsAPI.deletePost(id);
                navigate('/');
            } catch (err) {
                alert('Failed to delete post');
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await postsAPI.addComment(id, comment);
            setComment('');
            fetchPost(); // Refresh to show new comment
        } catch (err) {
            alert('Failed to add comment');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !post) {
        return <div style={styles.error}>{error || 'Post not found'}</div>;
    }

    const isAuthor = user && post.author._id === user.id;

    return (
        <div style={styles.container}>
            <Link to="/" style={styles.backLink}>
                ← Back to Posts
            </Link>

            <article style={styles.article}>
                <h1>{post.title}</h1>

                <div style={styles.meta}>
                    By {post.author.username} • {post.category.name} • {new Date(post.createdAt).toLocaleDateString()}
                </div>

                {post.featuredImage && (
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        style={styles.image}
                    />
                )}

                <div style={styles.content}>
                    {post.content}
                </div>

                {isAuthor && (
                    <div style={styles.actions}>
                        <Link to={`/edit-post/${post._id}`} style={styles.editButton}>
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            style={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </article>

            {/* Comments Section */}
            <section style={styles.commentsSection}>
                <h2>Comments ({post.comments.length})</h2>

                {user && (
                    <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                style={styles.textarea}
                rows="3"
            />
                        <button type="submit" style={styles.commentButton}>
                            Add Comment
                        </button>
                    </form>
                )}

                <div style={styles.commentsList}>
                    {post.comments.map((comment, index) => (
                        <div key={index} style={styles.comment}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                {comment.user.username}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                {comment.content}
                            </div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                {new Date(comment.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 1rem'
    },
    backLink: {
        display: 'inline-block',
        marginBottom: '1rem',
        color: '#007bff',
        textDecoration: 'none'
    },
    article: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem'
    },
    meta: {
        color: '#666',
        marginBottom: '1.5rem'
    },
    image: {
        width: '100%',
        maxHeight: '400px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '1.5rem'
    },
    content: {
        lineHeight: '1.8',
        fontSize: '1.1rem',
        whiteSpace: 'pre-wrap'
    },
    actions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem'
    },
    editButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px'
    },
    deleteButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    commentsSection: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px'
    },
    commentForm: {
        marginBottom: '2rem'
    },
    textarea: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '0.5rem',
        fontFamily: 'inherit'
    },
    commentButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    commentsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    comment: {
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
    },
    error: {
        padding: '1rem',
        backgroundColor: '#fee',
        color: '#c00',
        borderRadius: '4px',
        textAlign: 'center'
    }
};

export default PostDetail;