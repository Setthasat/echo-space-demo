import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Body() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentName, setCommentName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [commentAnonymous, setCommentAnonymous] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [commentSuccess, setCommentSuccess] = useState('');
    const [recentComments, setRecentComments] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/posts`)
            .then(res => {
                setPosts(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const openCommentModal = (post) => {
        setSelectedPost(post);
        setRecentComments(post.comments ? [...post.comments].reverse().slice(0, 5) : []);
        setShowCommentModal(true);
        setCommentName('');
        setCommentText('');
        setCommentAnonymous(false);
        setCommentError('');
        setCommentSuccess('');
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setCommentLoading(true);
        setCommentError('');
        setCommentSuccess('');
        // Optimistic update
        const optimisticComment = {
            name: commentAnonymous ? 'Anonymous' : commentName,
            comment: commentText,
            _optimistic: true
        };
        setRecentComments([optimisticComment, ...recentComments].slice(0, 5));
        setCommentName('');
        setCommentText('');
        setCommentAnonymous(false);
        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/posts/comments`, {
                postID: selectedPost.postID,
                name: optimisticComment.name,
                comment: optimisticComment.comment
            });
            if (res.status !== 200) throw new Error(res.data.message || 'Failed to comment');
            setCommentSuccess('คอมเมนต์ของคุณถูกส่งแล้ว!');
            setRecentComments((prev) => {
                const filtered = prev.filter(c => !c._optimistic);
                return [{ name: optimisticComment.name, comment: optimisticComment.comment }, ...filtered].slice(0, 5);
            });
        } catch (err) {
            setCommentError(err.response?.data?.message || err.message);
            setRecentComments((prev) => prev.filter(c => !c._optimistic));
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <main className="w-full flex flex-col items-center px-4">
            <section className="max-w-3xl w-full text-center my-10">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">โพสต์ล่าสุด</h2>
                {loading ? (
                    <div className="text-gray-400">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, idx) => (
                            <div key={post._id || idx} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-100">
                                <div className="flex items-center gap-2 font-semibold text-gray-800">
                                    {post.name || 'Anonymous'}
                                </div>
                                <div className="text-gray-600 text-sm text-start">{post.description}</div>
                                <div className="flex gap-4 mt-2 text-gray-400 text-xs">
                                    <button
                                        className="bg-green-600 w-full text-white p-2 rounded hover:bg-green-700"
                                        onClick={() => openCommentModal(post)}
                                    >
                                        comment ({post.comments.length})
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {showCommentModal && selectedPost && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm bg-opacity-40 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowCommentModal(false)}
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-2">คอมเมนต์โพสต์</h2>
                        <div className="mb-2 text-gray-700 font-medium">{selectedPost.description}</div>
                        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="comment-anonymous"
                                    checked={commentAnonymous}
                                    onChange={e => setCommentAnonymous(e.target.checked)}
                                />
                                <label htmlFor="comment-anonymous" className="text-sm">ไม่เปิดเผยชื่อ (Anonymous)</label>
                            </div>
                            {!commentAnonymous && (
                                <input
                                    type="text"
                                    className="border rounded px-3 py-2"
                                    placeholder="ชื่อของคุณ"
                                    value={commentName}
                                    onChange={e => setCommentName(e.target.value)}
                                    required
                                />
                            )}
                            <textarea
                                className="border rounded px-3 py-2"
                                placeholder="คอมเมนต์ของคุณ"
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                required
                                rows={3}
                            />
                            {commentError && <div className="text-red-500 text-sm">{commentError}</div>}
                            {commentSuccess && <div className="text-green-600 text-sm">{commentSuccess}</div>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                                disabled={commentLoading}
                            >
                                {commentLoading ? 'กำลังส่ง...' : 'ส่งคอมเมนต์'}
                            </button>
                        </form>
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-700">คอมเมนต์ล่าสุด</h3>
                            <div className="max-h-40 overflow-y-auto flex flex-col gap-2">
                                {recentComments.length === 0 && <div className="text-gray-400 text-sm">ยังไม่มีคอมเมนต์</div>}
                                {recentComments.map((c, i) => (
                                    <div key={i} className="bg-gray-50 rounded p-2 text-left">
                                        <span className="font-medium text-green-700 text-xs">{c.name || 'Anonymous'}</span>
                                        <div className="text-gray-700 text-sm">{c.comment}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Body;
