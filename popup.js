let historyList = document.getElementById('historyList');


chrome.history.search(
  {text: "radiant", maxResults: 5},
  function(episodes){
      for(let i in episodes){
        let hisItem = document.createElement('li');
        hisItem.innerHTML = episodes[i].title.replace("- Watch on Crunchyroll", '');
        historyList.appendChild(hisItem);
      }
})
