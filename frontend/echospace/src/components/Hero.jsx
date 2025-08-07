import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Hero() {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setShowModal(false);
                setSuccess('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleCreatePost = async (e) => {
        e.preventDefault();

        setSuccess('โพสต์ของคุณถูกสร้างเรียบร้อยแล้ว!');
        const optimisticPost = {
            postID: Date.now().toString(),
            name: anonymous ? 'Anonymous' : name,
            description,
        };

        setName('');
        setDescription('');
        setAnonymous(false);
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/create`, optimisticPost);
            if (res.status !== 201) throw new Error(res.data.message || 'โพสต์ไม่สำเร็จ');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full flex flex-col items-center justify-center text-center py-16 bg-gradient-to-b from-white to-green-50 mt-[2rem]">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                A quiet space for <span className="text-green-600 underline decoration-green-300">loud thoughts.</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-xl">
                พื้นที่ปลอดภัยสำหรับนักเรียนในการตั้งคำถาม ขอความช่วยเหลือ และเชื่อมต่อกับเพื่อนๆ แบ่งปันความคิดของคุณแบบไม่เปิดเผยชื่อหรือเปิดเผยชื่อก็ได้ ทุกอย่างขึ้นอยู่กับคุณ
            </p>
            <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all"
                onClick={() => setShowModal(true)}
            >
                ขอความช่วยเหลือ
            </button>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm bg-opacity-40 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => { setShowModal(false); setError(''); setSuccess(''); }}
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">สร้างโพสต์ใหม่</h2>
                        <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    checked={anonymous}
                                    onChange={e => setAnonymous(e.target.checked)}
                                />
                                <label htmlFor="anonymous" className="text-sm">ไม่เปิดเผยชื่อ (Anonymous)</label>
                            </div>
                            {!anonymous && (
                                <input
                                    type="text"
                                    className="border rounded px-3 py-2"
                                    placeholder="ชื่อของคุณ"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            )}
                            <textarea
                                className="border rounded px-3 py-2"
                                placeholder="รายละเอียดหรือคำถามของคุณ"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                rows={4}
                            />
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            {success && <div className="text-green-600 text-sm">{success}</div>}
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                                disabled={loading}
                            >
                                {loading ? 'กำลังโพสต์...' : 'โพสต์'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Hero;
