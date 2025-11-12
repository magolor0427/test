'use client'; 

import { useState, useMemo } from 'react';
import AuthWrapper from './AuthWrapper';
import Link from 'next/link';
import articlesData from '../data/article.json'; 
import ArticleTagging from './components/ArticleTagging';

function getArticlesData() {
    const articlesArray = articlesData.articles; 
  if (!Array.isArray(articlesArray)) {
    console.error("記事データが配列ではありませんでした:", articlesData);
    return [];
  }
  const sortedArticles = articlesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  return sortedArticles;
}

export default function Home() {
    const allArticles = getArticlesData();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterYear, setFilterYear] = useState('');

    const filteredArticles = useMemo(() => {
        let currentArticles = allArticles;

        // 検索ワードによるフィルタリング
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            currentArticles = currentArticles.filter(article => 
                article.title.toLowerCase().includes(lowerCaseSearch) || 
                article.content_excerpt.toLowerCase().includes(lowerCaseSearch) ||
                article.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch))
            );
        }

        // 年代によるフィルタリング
        if (filterYear) {
            currentArticles = currentArticles.filter(article => 
                String(article.year) === filterYear
            );
        }
        
        return currentArticles;
    }, [allArticles, searchTerm, filterYear]);

    const availableYears = useMemo(() => {
        const years = allArticles.map(a => String(a.year));
        return [...new Set(years)].sort((a, b) => b - a);
    }, [allArticles]);


    return (
        <AuthWrapper> 
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <h1>AGHS出版部データベース</h1>

                <div style={filterContainerStyle}>
                    <input
                        type="text"
                        placeholder="タイトル、内容、タグで検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={searchInputStyle}
                    />

                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">全ての年代</option>
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}年</option>
                        ))}
                    </select>
                </div>
                {/* -------------------------------------- */}

                <h2>
                    記事一覧 
                    {searchTerm || filterYear ? 
                        `(${filteredArticles.length} 件 / 全${allArticles.length}件)` : 
                        `(${allArticles.length} 件)`}
                </h2>
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {filteredArticles.length === 0 ? (
                        <p>該当する記事が見つかりませんでした。</p>
                    ) : (
                        filteredArticles.map((article) => (
                            <li key={article.id} style={articleItemStyle}>
                                <div style={articleTitleStyle}>
                                    <Link href={`/article/${article.id}`} style={{ textDecoration: 'none', color: '#0070f3' }}>
                                        {article.title}
                                    </Link>
                                </div>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    号数: {article.id} / 出版日: {article.date}
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    {article.content_excerpt}
                                </p>
                                <div style={tagContainerStyle}>
                                    {article.tags.map((tag) => (
                                        <span key={tag} style={tagStyle}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <ArticleTagging articleId={article.id} />
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </AuthWrapper>
    );
}

const filterContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #eee',
    color: '#000'
};

const searchInputStyle = {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #100000ff'
};

const selectStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minWidth: '150px'
};

const articleItemStyle = {
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '15px',
};

const articleTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '5px',
};

const tagContainerStyle = {
  marginTop: '10px',
};

const tagStyle = {
  display: 'inline-block',
  background: '#f0f0f0',
  color: '#333',
  padding: '3px 8px',
  marginRight: '5px',
  borderRadius: '4px',
  fontSize: '0.8rem',
};
