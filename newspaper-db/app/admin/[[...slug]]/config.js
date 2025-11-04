// GitHub認証のための情報
const config = {
  // 認証設定 (CMSのログイン方法)
  backend: {
    name: 'git-gateway',
    branch: 'main',
    repo: 'magolor0427/test', 
    identity: 'https://test.netlify.app/.netlify/identity',
  },
  
  // 管理画面のデザイン設定
  local_backend: true,
  publish_mode: 'editorial_workflow',
  media_folder: 'public/images',
  public_folder: '/images',
  
  // コンテンツ設定 (管理するデータファイル)
  collections: [
    {
      name: 'articles', // 内部名 (URLなどには使われません)
      label: '学校新聞 記事', // 管理画面で表示される名前
      folder: 'data', // ファイルを保存するフォルダ (既存の 'data' フォルダ)
      identifier_field: 'title',
      extension: 'json', // ファイル形式を JSON に設定
      format: 'json', // ファイル形式を JSON に設定

      // 記事一覧として表示するファイル名を指定
      files: [
        {
          file: 'data/articles.json', // 既存のJSONファイルパス
          label: '記事データ全体 (articles.json)',
          name: 'articles_data',
          
          // JSONファイル内のデータ構造を定義
          fields: [
            {
              name: 'articles', 
              label: '記事リスト',
              widget: 'list', // リスト形式で記事の配列を扱う
              summary: '{{fields.title}} ({{fields.year}})', // リスト内で記事を識別するための表示形式
              
              // 記事一つ一つのデータ構造 (JSON構造と同じにする)
              fields: [
                { label: '記事ID (ユニークな数字)', name: 'id', widget: 'number', value_type: 'int', required: true, hint: '他の記事と重複しないユニークな整数を入力してください。'},
                { label: '記事タイトル', name: 'title', widget: 'string', required: true },
                { label: '記事の年代', name: 'year', widget: 'number', value_type: 'int', required: true, hint: '発行年を数字で入力してください。'},
                { label: '号数', name: 'issue', widget: 'string' },
                { label: '発行日 (YYYY-MM-DD)', name: 'date', widget: 'date', required: true },
                { label: '記事の抜粋', name: 'content_excerpt', widget: 'string', required: true, hint: '記事一覧に表示される短いテキストです。' },
                { label: '記事の全文', name: 'content_full', widget: 'markdown', required: true, hint: '記事の詳細ページで表示される全文です。' },
                { label: '固定タグ', name: 'tags', widget: 'list', field: { label: 'タグ名', name: 'tag_item', widget: 'string' } },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default config;