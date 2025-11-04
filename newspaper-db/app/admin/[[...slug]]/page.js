'use client'; 

import { useEffect, useState } from 'react'; // useStateも使用します

import config from './config'; 

export default function AdminPage() {
  const [CmsComponent, setCmsComponent] = useState(null);

  useEffect(() => {
    import('decap-cms')
      .then(module => {
        // CMSのオブジェクトを取得
        const CMS = module.CMS; 
        
        // init() に config オブジェクトを渡し、初期化を実行
        CMS.init({ config }); 

        // CMSのコンポーネント自体をステートにセット
        setCmsComponent(() => module.CMSPage);
        
        // 以前のエラー (Failed to load config.yml) も init() で上書きされるため、ここで解決するはずです。

      })
      .catch(error => {
        console.error("CMSの読み込みに失敗しました:", error);
      });
      
  }, []);

  // CMSコンポーネントが読み込まれていればそれを表示、なければローディングメッセージを表示
  if (CmsComponent) {
    // CMSPage コンポーネントをレンダリングすることで、CMSのUIが表示される
    return <CmsComponent />;
  }

  // ローディング画面
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>CMS 管理画面を読み込み中...</h1>
      <p>Decap CMS は GitHub 認証を使用します。管理者アカウントでログインしてください。</p>
    </div>
  );
}