var ArtistId;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var url = tabs[0].url;
    var urlElement = document.getElementById('current-url');
    parts=url.toString().split('/');
    ArtistId=parts[parts.length-1].toString();
    urlElement.textContent ="Artist ID: "+ArtistId;
  });
document.getElementById("submitButton").addEventListener("click", function () {
  var resultMessage1 = document.getElementById("resultMessage1");
  var resultMessage2 = document.getElementById("resultMessage2");
  var resultMessage3 = document.getElementById("resultMessage3");
  var resultMessage4 = document.getElementById("resultMessage4");
  const accessToken =
    "BQCJ1jsp1xNt7kMbl-fOnJLywSzcK7whNz_Z6702VlLvbcG0i5_GXvaSn1qkXd0y6ZDk-tYBjddKOXCrayBO56kq4AMMvD2xlWXLcMfeGOW4rkj_Hhs";

  const url = `https://api.spotify.com/v1/artists/${ArtistId}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      console.log(`STATUS: ${response.status}`);
      console.log(`HEADERS: ${response.headers}`);
      return response.text();
    })
    .then((data) => {
        const name = JSON.parse(data).name.toString();
        const genres = JSON.parse(data).genres.toString();
        const followersTotal = JSON.parse(data).followers.total.toString();
        const popularity = JSON.parse(data).popularity.toString();
        resultMessage1.textContent=`NAME: ${name}`;
        resultMessage2.textContent=`GENRES: ${genres}`;
        resultMessage3.textContent=`FOLLOWERS: ${followersTotal}`;
        resultMessage4.textContent=`POPULARITY: ${popularity}`;
        //resultMessage.textContent=JSON.parse(data).name;

    })
    .catch((error) => {
        resultMessage.textContent=error;
    });
});
