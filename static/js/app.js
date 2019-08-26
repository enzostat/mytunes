console.log("Locked and loaded");

document.getElementById("search-button").addEventListener("click", function(e){
    e.preventDefault();
    console.log("Clicked");
	// var inputField = document.getElementById("input");
	// inputField.textContent = " ";
	// clearField();
	playFetch();

})


function playFetch(){
	var searchQuery = document.getElementById("query").value;
	console.log(searchQuery);

    //perform fetch
    //http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=cher&api_key=YOUR_API_KEY&format=json

    fetch("https://ws.audioscrobbler.com/2.0/?method=artist.search&artist="+searchQuery+"api_key="+process.env.api_key+"&format=json")
    .then(function(responseDate) {
        return responseDate.json();
    })
    .then(function(jsonData) {
        console.log(jsonData);
        // jsonData.forEach(function(results) {
        //     console.log(results)
        //         // document.getElementById("container-div").append(catPic);
        // })
    })

}


// function clearField(){
// 	$("#results").empty();
// }








