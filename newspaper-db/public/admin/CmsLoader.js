'use client'; 

import { useEffect } from 'react';
import { CMS } from 'decap-cms';

// 設定ファイルは静的にインポート
import config from './config'; 

// CMSの初期化処理を実行するコンポーネント
export default function CmsLoader() {
  
  useEffect(() => {
    // CMSがまだ初期化されていない場合のみ実行
    if (window.CMS_INITIALIZED) {
        return;
    }

    // config.yml の自動ロードを無効にする処理を再度強制
    CMS.registerEventListener({
      name: 'preInit',
      handler: ({ config }) => {
        config.configLoader = () => Promise.resolve(config);
      },
    });

    // config.js のオブジェクトで初期化を実行
    CMS.init({ config });
    
    // 初期化フラグを設定
    window.CMS_INITIALIZED = true;

  }, []);

  // CMS本体がレンダリングされるまで、ローディングメッセージを表示
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>CMS 管理画面を読み込み中...</h1>
      <p>Decap CMS は GitHub 認証を使用します。管理者アカウントでログインしてください。</p>
    </div>
  );
}