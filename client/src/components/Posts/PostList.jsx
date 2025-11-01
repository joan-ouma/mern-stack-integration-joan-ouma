import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../../services/api';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState(''); // For immediate input display
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        page: 1
    });
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    // Debounce search - only search after user stops typing for 500ms
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(debounceTimer); // Clean up timer
    }, [searchInput]);

    useEffect(() => {
        fetchPosts();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAllCategories();
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await postsAPI.getAllPosts(filters);
            setPosts(response.data.posts);
            setPagination({
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalPosts: response.data.totalPosts
            });
        } catch (err) {
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    if (loading && posts.length === 0) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            <h1>Blog Posts</h1>

            {/* Search and Filter */}
            <div style={styles.filterContainer}>
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={styles.searchInput}
                    />
                    {searchInput && (
                        <button
                            onClick={() => setSearchInput('')}
                            style={styles.clearButton}
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                    style={styles.select}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {/* Loading indicator */}
            {loading && (
                <div style={styles.loadingOverlay}>
                    <div style={styles.spinner}>Searching...</div>
                </div>
            )}

            {/* Posts Grid */}
            <div style={styles.grid}>
                {posts.length === 0 ? (
                    <div style={styles.noResults}>
                        No posts found. {searchInput && `Try a different search term.`}
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post._id} style={styles.card}>
                            {post.featuredImage && (
                                <img
                                    src={`http://localhost:5000${post.featuredImage}`}
                                    alt={post.title}
                                    style={styles.image}
                                />
                            )}
                            <div style={styles.cardContent}>
                                <h3>{post.title}</h3>
                                <p style={styles.meta}>
                                    By {post.author?.username} • {post.category?.name}
                                </p>
                                <p style={styles.excerpt}>
                                    {post.content.substring(0, 150)}...
                                </p>
                                <Link to={`/posts/${post._id}`} style={styles.link}>
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div style={styles.pagination}>
                    <button
                        onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        disabled={filters.page === 1}
                        style={{
                            ...styles.pageButton,
                            ...(filters.page === 1 ? styles.pageButtonDisabled : {})
                        }}
                    >
                        Previous
                    </button>
                    <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                    <button
                        onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        disabled={filters.page >= pagination.totalPages}
                        style={{
                            ...styles.pageButton,
                            ...(filters.page >= pagination.totalPages ? styles.pageButtonDisabled : {})
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    filterContainer: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
    searchContainer: { position: 'relative', flex: 1, minWidth: '250px' },
    searchInput: {
        width: '100%',
        padding: '0.5rem 2rem 0.5rem 0.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem'
    },
    clearButton: {
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        color: '#999',
        padding: '0 8px'
    },
    select: { padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' },
    loadingOverlay: {
        textAlign: 'center',
        padding: '1rem',
        color: '#666',
        fontStyle: 'italic'
    },
    spinner: {
        display: 'inline-block',
        padding: '0.5rem 1rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px'
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
        backgroundColor: 'white'
    },
    image: { width: '100%', height: '200px', objectFit: 'cover' },
    cardContent: { padding: '1.5rem' },
    meta: { color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' },
    excerpt: { color: '#333', marginBottom: '1rem', lineHeight: '1.5' },
    link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' },
    pageButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    pageButtonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed'
    },
    error: { padding: '1rem', backgroundColor: '#fee', color: '#c00', borderRadius: '4px', marginBottom: '1rem' },
    noResults: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '3rem',
        color: '#666',
        fontSize: '1.1rem'
    }
};

export default PostList;