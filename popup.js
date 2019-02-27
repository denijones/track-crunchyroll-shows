//Place episode history in a list
let historyList = document.getElementById('historyList');
//Put episodes in an array
let episodesVisited = [];
//Put anime shows into an array
let showsVisited = [];

//Use history API to search for crunchyroll objects & limit search results
chrome.history.search(
  {text: "crunchyroll", maxResults: 5},
  //View the object results
  function(episodes){
    //Access each object
      for(let i in episodes){
        //Create a regex to find started shows (episode 1)
        let regexShow = /\/episode-1/;
        //Create a regex for episode numbers
        let showName = episodes[i].title.replace(/ Episode \d+ - Watch on Crunchyroll/, '');
        //Test URL's for matching "episode 1" regex
        if(regexShow.test(episodes[i].url)){
          //Add show to an array without duplicates
          if(!(showName in showsVisited)){
            showsVisited.push(showName);
          }
        }

        //Find URL's from crunchyroll and include the word episode in the title
        if(episodes[i].url.includes('crunchyroll.com') && episodes[i].title.includes('Episode')){
          //Add an item to the HTML page unordered list
          let histItem = document.createElement('li');
          episodeNamenNum = episodes[i].title.replace("- Watch on Crunchyroll", '');
          histItem.innerHTML = episodeNamenNum;
          historyList.appendChild(histItem);
          //Create an array of episode pages visited
          if(!(episodeNamenNum in episodesVisited))
          episodesVisited.push(episodes[i].title.match(episodeNamenNum));
        }
      }
})

console.log(episodesVisited);
console.log(showsVisited);
