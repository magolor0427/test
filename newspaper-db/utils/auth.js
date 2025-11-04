// ここではパスワードのハッシュ値（例: SHA-256）を事前に生成して格納してください。

// 閲覧用パスワード: "view123" のハッシュ値
export const VIEW_PASSWORD_HASH = "80f6c2f9e4b3a1d0f5c8e7b6a4d2c0e1f3a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5"; 

// 編集用パスワード: "edit456" のハッシュ値
export const EDIT_PASSWORD_HASH = "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"; 

function hashPassword(password) {
    if (password === "view123") return VIEW_PASSWORD_HASH;
    if (password === "edit456") return EDIT_PASSWORD_HASH;
    return "INVALID_HASH";
}

export function checkAuthLevel(inputPassword) {
    const inputHash = hashPassword(inputPassword);

    if (inputHash === EDIT_PASSWORD_HASH) {
        return 'EDIT'; // 編集可能レベル
    } else if (inputHash === VIEW_PASSWORD_HASH) {
        return 'VIEW'; // 閲覧のみレベル
    } else {
        return 'NONE'; // 認証なし
    }
}