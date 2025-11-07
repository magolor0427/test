// newspaper-db/app/AuthWrapper.js
'use client'; 

import { useState, useEffect } from 'react';
import { checkAuthLevel } from '../utils/auth';

// 認証状態の定義
const AUTH_STATUS = {
    NONE: 'none',   // 未認証
    VIEW: 'view',   // 閲覧可能
    EDIT: 'edit'    // 編集可能
};

export default function AuthWrapper({ children }) {
    // 認証状態と、認証レベル（VIEW or EDIT）を管理
    const [authStatus, setAuthStatus] = useState(AUTH_STATUS.NONE);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 初回ロード時にLocalStorageから以前の認証状態を復元 (利便性のため)
    useEffect(() => {
        const storedPassword = localStorage.getItem('newspaper_password');
        if (storedPassword) {
            handleLogin(storedPassword);
        }
    }, []);

    // ログイン処理
    const handleLogin = (pw = password) => {
        setError('');
        const level = checkAuthLevel(pw);

        if (level === 'EDIT') {
            setAuthStatus(AUTH_STATUS.EDIT);
            localStorage.setItem('newspaper_auth_level', 'EDIT');
            localStorage.setItem('newspaper_password', pw);
        } else if (level === 'VIEW') {
            setAuthStatus(AUTH_STATUS.VIEW);
            localStorage.setItem('newspaper_auth_level', 'VIEW');
            localStorage.setItem('newspaper_password', pw);
        } else {
            setError('パスワードが間違っています。');
            setAuthStatus(AUTH_STATUS.NONE);
            localStorage.removeItem('newspaper_auth_level');
            localStorage.removeItem('newspaper_password');
        }
    };

    // ログアウト処理
    const handleLogout = () => {
        // ローカルストレージから認証情報を削除
        localStorage.removeItem('newspaper_password');
        localStorage.removeItem('newspaper_auth_level');
        
        // 状態をリセットして未認証に戻す
        setAuthStatus(AUTH_STATUS.NONE);
        setPassword('');
        setError('');
    };

    if (authStatus !== AUTH_STATUS.NONE) {
        return (
            <>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    alignItems: 'center', 
                    padding: '10px 20px', 
                    borderBottom: '1px solid #eee', 
                    marginBottom: '10px' 
                }}>
                    <span style={{ marginRight: '15px', fontSize: '0.9em', color: '#555' }}>
                        現在のレベル: **{authStatus.toUpperCase()}**
                    </span>
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '8px 15px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9em'
                        }}
                    >
                        ログアウト
                    </button>
                </div>
                {children}
            </>
        );
    }

    // 未認証の場合、パスワード入力フォームを表示
    return (
        <div style={authContainerStyle}>
            <h1>📰 学校新聞データベース</h1>
            <h2>アクセス制限</h2>
            <p>記事を閲覧するためにはパスワードが必要です。</p>
            
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                style={inputStyle}
            />
            <button onClick={() => handleLogin()} style={buttonStyle}>
                アクセス
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            
            <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
                閲覧用パスワードと編集用パスワードが分かれています。
            </p>
        </div>
    );
}

// スタイリング
const authContainerStyle = {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
};

const inputStyle = {
    padding: '10px',
    width: '100%',
    margin: '10px 0',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};