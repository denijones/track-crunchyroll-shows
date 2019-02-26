let historyList = document.getElementById('historyList');

chrome.history.search(
  {text: "crunchyroll", maxResults: 5},
  function(episodes){
      for(let i in episodes){
        if(episodes[i].url.includes('crunchyroll.com') && episodes[i].title.includes('Episode')){
          let hisItem = document.createElement('li');
          hisItem.innerHTML = episodes[i].title.replace("- Watch on Crunchyroll", '');
          historyList.appendChild(hisItem);
        }
      }
})
