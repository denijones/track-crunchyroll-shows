//Place episode history in a list
let lastEpisode = document.getElementById('lastEpisodeHTML');
//Array of objects to track shows and episodes visited
let showList = [];
//Store tab show and title
let tabTitle, tabShow = "";

let isShowPage = false;

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
            showList.push({show:showName,episodes:[episodeNum],last:episodeNum, link: results[i].url});
          }
        }
      }

          let lastEpisodeList = document.createElement('li');
          let lastEpisodeLink = document.createElement('a');

          for(let k in showList){
            //Display last episode of current show
            if(tabShow === showList[k].show){
              //Add last episode link to the HTML page unordered list
              lastEpisodeLink.href = showList[k].link;
              lastEpisodeLink.innerHTML = showList[k].show + " - Episode: " + showList[k].last;
              lastEpisode.appendChild(lastEpisodeList);
              lastEpisodeList.appendChild(lastEpisodeLink);
            }
          }

  })

  //Open last episode link in a new tab
  window.addEventListener('click',function(e){
    if(e.target.href!==undefined){
      chrome.tabs.create({url:e.target.href})
    }
  })
console.log(showList);
