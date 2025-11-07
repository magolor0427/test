'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc,
    serverTimestamp // サーバー時間で投稿日時を記録
} from 'firebase/firestore';


export default function ArticleTagging({ articleId }) {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 認証レベルを取得（閲覧用アカウントでも投稿可能とするため、編集権限はチェックしません）
    const userAuthLevel = typeof window !== 'undefined' ? localStorage.getItem('newspaper_auth_level') : null;

    // 既存のタグをFirestoreから読み込む関数
    const fetchTags = async () => {
        setLoading(true);
        try {
            // Firestoreの 'tags' コレクションから、指定された articleId に一致するドキュメントを検索
            const tagsCol = collection(db, 'tags');
            const q = query(tagsCol, where('articleId', '==', articleId));
            const tagSnapshot = await getDocs(q);
            
            // タグの配列を作成
            const fetchedTags = tagSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // 重複を避けるため、タグ名でユニークにする (今回はシンプルに全て表示)
            setTags(fetchedTags.map(tag => tag.name)); 

        } catch (error) {
            console.error("タグの取得に失敗しました:", error);
            // ユーザーにエラーを通知するUIを追加することもできます
        } finally {
            setLoading(false);
        }
    };

    // 新しいタグをFirestoreに書き込む関数
    const handleAddTag = async () => {
        if (!newTag.trim() || isSubmitting) return;

        setIsSubmitting(true);
        
        try {
            await addDoc(collection(db, 'tags'), {
                articleId: articleId,
                name: newTag.trim(),
                createdAt: serverTimestamp(),
                // 投稿者のIDなど、必要に応じて追加情報を記録
            });
            
            // 成功したら、ローカルの状態を更新し、入力欄をクリア
            setTags(prev => [...prev, newTag.trim()]);
            setNewTag('');

        } catch (error) {
            console.error("タグの追加に失敗しました:", error);
            alert("タグの追加中にエラーが発生しました。");
        } finally {
            setIsSubmitting(false);
        }
    };

    // コンポーネントがマウントされたとき（記事が表示されたとき）にタグを読み込む
    useEffect(() => {
        if(articleId) {
            fetchTags();
        }
    }, [articleId]);

    if (userAuthLevel === 'NONE') {
        return null; // 未認証ユーザーにはタグ付けUIを表示しない
    }

    return (
        <div style={taggingContainerStyle}>
            <h3 style={headerStyle}>💬 閲覧者による追加タグ</h3>
            {loading ? (
                <p>読み込み中...</p>
            ) : (
                <div style={existingTagsStyle}>
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <span key={index} style={viewerTagStyle}>#{tag}</span>
                        ))
                    ) : (
                        <p style={{fontSize: '0.9em', color: '#888'}}>まだ追加されたタグはありません。</p>
                    )}
                </div>
            )}

            {/* タグ追加フォーム */}
            <div style={inputGroupStyle}>
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新しいタグを入力"
                    style={tagInputStyle}
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTag();
                    }}
                />
                <button 
                    onClick={handleAddTag} 
                    style={tagButtonStyle}
                    disabled={isSubmitting || !newTag.trim()}
                >
                    {isSubmitting ? '送信中...' : 'タグを追加'}
                </button>
            </div>
        </div>
    );
}

// スタイリング
const taggingContainerStyle = {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
};

const existingTagsStyle = {
    marginBottom: '15px',
};

const viewerTagStyle = {
    display: 'inline-block',
    background: '#e0f7fa',
    color: '#006064',
    padding: '4px 10px',
    marginRight: '8px',
    marginBottom: '8px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '500'
};

const inputGroupStyle = {
    display: 'flex',
    gap: '10px',
};

const tagInputStyle = {
    flexGrow: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    color: '#000'
};

const tagButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#4CAF50', // 緑色
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    opacity: '0.9'
};

const headerStyle = {
    color: '#000',
    marginBottom: '10px'
};


