import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../../services/api';

const PostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        status: 'draft'
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchPost();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAllCategories();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to load categories');
        }
    };

    const fetchPost = async () => {
        try {
            const response = await postsAPI.getPost(id);
            setFormData({
                title: response.data.title,
                content: response.data.content,
                category: response.data.category._id,
                status: response.data.status
            });
            if (response.data.featuredImage) {
                setImagePreview(`http://localhost:5000${response.data.featuredImage}`);
            }
        } catch (err) {
            setError('Failed to load post');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            data.append('category', formData.category);
            data.append('status', formData.status);
            if (image) {
                data.append('featuredImage', image);
            }

            if (isEditMode) {
                await postsAPI.updatePost(id, data);
            } else {
                await postsAPI.createPost(data);
            }

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>{isEditMode ? 'Edit Post' : 'Create New Post'}</h2>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={styles.input}
                        placeholder="Enter post title"
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Category *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={styles.input}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    {categories.length === 0 && (
                        <small style={styles.hint}>No categories available. Please create categories first.</small>
                    )}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Content *</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        style={styles.textarea}
                        placeholder="Write your post content here..."
                        rows="10"
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Featured Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={styles.input}
                    />
                    {imagePreview && (
                        <div style={styles.imagePreview}>
                            <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                        </div>
                    )}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        style={styles.input}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div style={styles.actions}>
                    <button type="submit" disabled={loading} style={styles.submitButton}>
                        {loading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={styles.cancelButton}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem'
    },
    form: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    formGroup: {
        marginBottom: '1.5rem'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'inherit',
        lineHeight: '1.5',
        resize: 'vertical',
        boxSizing: 'border-box'
    },
    imagePreview: {
        marginTop: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '0.5rem',
        textAlign: 'center'
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '300px',
        objectFit: 'contain'
    },
    hint: {
        display: 'block',
        marginTop: '0.25rem',
        fontSize: '0.875rem',
        color: '#666'
    },
    actions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem'
    },
    submitButton: {
        flex: 1,
        padding: '0.75rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    cancelButton: {
        flex: 1,
        padding: '0.75rem',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    error: {
        padding: '1rem',
        backgroundColor: '#fee',
        color: '#c00',
        borderRadius: '4px',
        marginBottom: '1rem',
        border: '1px solid #fcc'
    }
};

export default PostForm;