const indexModule = (() => {
  // 検索ボタンクリック時のイベントリスナーと登録
  document.getElementById("searchBtn").addEventListener("click", () => {
    return searchModule.searchUsers();
  });
  // usersモジュールのfetchAllUsersメソッドを呼び出す
  return usersModule.fetchAllUsers();
})();
