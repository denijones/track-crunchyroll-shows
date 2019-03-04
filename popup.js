//Place episode history in a list
let lastEpisode = document.getElementById('lastEpisodeHTML');
//Array of objects to track shows and episodes visited
let showList = [];
//Store tab show and title
let tabTitle, tabShow = "";
//Check current tab page
let isMainPage = false;
let isShowPage = false;
// Regex for shows that have the word 'Episode' in them
const episodeRegex = / Episode/;

/* Seperate show title and episode number into array
Example: <title>JoJo's Bizarre Adventure: Golden Wind Episode 1 - Watch on Crunchyroll</title>
0:"JoJo's Bizarre Adventure: Golden Wind", 1:"1" */
function splitTitle(title){
  return title.title.replace(" - Watch on Crunchyroll",'').split(episodeRegex);
}

// TODO: Refactor
function displayShow(showList,k){
  let lastEpisodeList = document.createElement('li');
  let lastEpisodeLink = document.createElement('a');
  lastEpisodeLink.href = showList[k].link;
  lastEpisodeLink.innerHTML = "<b>" + showList[k].show + "</b>" + " - Episode: " + "<b>" + showList[k].last + "</b>";
  lastEpisode.appendChild(lastEpisodeList);
  lastEpisodeList.appendChild(lastEpisodeLink);
}

// Use tabs API to get current tab information
chrome.tabs.query({active: true,currentWindow: true,url: "https://www.crunchyroll.com/*"}, function(tabs) {
  // Get current tab's show information, to display last episode
  if(episodeRegex.test(tabs[0].title)){
    tabTitle = splitTitle(tabs[0]);
    tabShow = tabTitle[0];
  }else if(tabs[0].title.includes(' - Watch on Crunchyroll')){
    tabShow = tabs[0].title.replace(" - Watch on Crunchyroll",'');
  }
  // Check if this is the main show list page, to display list of shows watched
  isMainPage = tabs[0].url === "https://www.crunchyroll.com/videos/anime";
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
        if(results[i].url.includes('crunchyroll.com') && episodeRegex.test(results[i].title)){
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
          // TODO: Refactor and clean up
          for(let k in showList){
            //Display last episode of current show
            if(tabShow === showList[k].show){
              //Add last episode link to the HTML page unordered list
              displayShow(showList,k);
            }else if(isMainPage){
              displayShow(showList,k);
            }
          }

  })

  //Open last episode link in a new tab
  window.addEventListener('click',function(e){
    if(e.target.href!==undefined){
      chrome.tabs.create({url:e.target.href})
    }
  })

// Check if working properly
console.log(showList);
