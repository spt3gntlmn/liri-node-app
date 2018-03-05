require("dotenv").config();

let fs = require("fs"); //reads and writes files
let twitter = require("twitter");
let spotify = require("spotify");
let request = require("request");
let liriArg = process.argv[2];
let keys = require("./keys.js");

// let mySpotify = new spotify(keys.spotify);
let myTwitter = new twitter(keys.twitter);


// Make it so liri.js can take in one of the following commands:
switch (liriArg) {
	case "test": console.log("Zoom says the teen w/ the new care!");
	case `my-tweets`: Tweets(), console.log("hey!"); break;
	case `spotify-this-song`: spotifyThisSong(); break;
	case `movie-this`: movieThis(); break;
	case `do-what-it-says`: doWhatItSays(); break;
	// The default case
	default: console.log(`\nPlease type: 'node liri.js' and then type in one of the following:
		my-tweets\n
		spotify-this-song\n
		movie-this\n
		do-what-it-says\n
		Note: if the title is more than one word place quotes ("") around it.  Thanks!
		`)
};

// Twitter bot stuff

function Tweets() {
	let myTwitter = new twitter(
		{
			consumer_key: process.env.TWITTER_CONSUMER_KEY,
			consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
			access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
			access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
		});

	let twitUsername = process.argv[3];
	if (!twitUsername) {
		twitUsername = 'liri-bots';
	}
	let params = { screen_name: twitUsername };
	myTwitter.get("statuses/user_timeline/", params, function (error, tweets, response) {
		if (!error) {
			for (var i = 0; i < 20; i++) {
				//console.log(response); // Show the full response in the terminal
				var twitterResult
				"@" + tweets[i].user.screen_name + ": " +
					tweets[i].text + "\r\n" +
					tweets[i].create_at + "\r\n" +
					"------------------------------ " + i + " ------------------------------" + "\r\n";
				console.log(twitterResults);
				log(twitterResults); // calling log function
			}
		} else {
			console.log("Error :" + error);
			return;
		}
	});
}