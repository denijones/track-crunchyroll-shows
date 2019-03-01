//Place episode history in a list
let historyList = document.getElementById('historyList');
//Array of objects to track shows and episodes visited
let showList = [];
//Store tab show and title
let tabTitle, tabShow = "";

/* Seperate show title and episode number into array
Example: <title>JoJo's Bizarre Adventure: Golden Wind Episode 1 - Watch on Crunchyroll</title>
0:"JoJo's Bizarre Adventure: Golden Wind", 1:"1" */
function splitTitle(title){
  return title.title.replace(" - Watch on Crunchyroll",'').split(' Episode');
}

chrome.tabs.query({active: true,currentWindow: true,url: "https://www.crunchyroll.com/*"}, function(tabs) {
  if(tabs[0].title.includes('Episode')){
    tabTitle = splitTitle(tabs[0]);
    tabShow = tabTitle[0];
  }else if(tabs[0].title.includes(' - Watch on Crunchyroll')){
    tabShow = tabs[0].title.replace(" - Watch on Crunchyroll",'');
  }
})

//Use history API to search for crunchyroll objects & limit search results
chrome.history.search(
  {text: "crunchyroll", maxResults: 100},
  //View the object results
  function(results){
    //Access each object
      for(let i in results){
        let episodeNum = 0;
        let showName = "";
        let showPresent = false;
        //Find URL's only from crunchyroll and only the show episodes, not episode list page
        if(results[i].url.includes('crunchyroll.com') && results[i].title.includes('Episode')){
          //Spilt the title for storing in object
          let splitEpisode = splitTitle(results[i]);
          //Change episode string number into int
          episodeNum = parseInt(splitEpisode[1],10);
          showName = splitEpisode[0];
          //Add to array as object
          for(let j in showList){
            if(showName === showList[j].show){
              showList[j].episodes.push(episodeNum);
              //Find max episode, Math.max() cannot take the object's array so apply() will allow it
              showList[j].last = Math.max.apply(Math,showList[j].episodes);
              showPresent = true;
            }
          }
          //If show isn't listed then add it in
          if(showPresent === false){
            showList.push({show:showName,episodes:[episodeNum],last:episodeNum});
          }
        }
      }
          //Display last episode of current show
          for(let k in showList){
            if(tabShow === showList[k].show){
              //Add an item to the HTML page unordered list
              let histItem = document.createElement('li');
              histItem.innerHTML = "Episode: " + showList[k].last;
              historyList.appendChild(histItem);
            }
          }

  })

console.log(showList);
