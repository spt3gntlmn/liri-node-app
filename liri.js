require("dotenv").config();

let inquirer = require(`inquirer`);
let fs = require("fs"); //reads and writes files
let keys = require("./keys.js");
let Twitter = require("twitter");
let Spotify = require("node-spotify-api");
let request = require("request");
let liriArg = process.argv[2];
let twittersToPrint = [];
let twitterObj;
let title = `The Sign Ace of Base`;
let movie = `Mr. Nobody`;
// let title = process.argv[3];
let userChoice;

let samsTwitter = new Twitter(keys.twitter);

inquirer
	.prompt([
		{
			type: "list",
			message: "What would you like to do?",
			choices: [`my-tweets`, `spotify-this-song`, `movie-this`, `do-what-it-says`],
			name: "options"
		},
	]).then(function (user) {
		// Make it so liri.js can take in one of the following commands:
		userChoice = user.options;
		console.log(userChoice);
		switch (userChoice) {
			// case "test": console.log("Zoom says the teen w/ the new car!"); break;
			case `my-tweets`: Tweets(); break;

			// Spotify portion of the switch cases
			case `spotify-this-song`:
				inquirer.prompt([
					{
						type: "input",
						message: `What song would you like to Spotify? Type the title\n Place quotes ("") around the title if more than one word.\n`,
						name: "title"
					},
					{
						type: "confirm",
						message: "Are you sure:",
						name: "confirm",
						default: true
					}
				])
					.then(function (userResponse) {
						if (userResponse.title !== "") {
							title = userResponse.title;
						};
						if (userResponse.confirm) { spotifyCall(title) };
					});
				break;

			// Movie-This portion of the switch
			case `movie-this`:
				inquirer.prompt([
					{
						type: "input",
						message: `What movie you like to search? Type the title\n Place quotes ("") around the title if more than one word.\n`,
						name: "movie"
					},
					{
						type: "confirm",
						message: "Are you sure:",
						name: "confirm",
						default: true
					}
				])
					.then(function (userResponse) {
						if (userResponse.movie !== "") {
							movie = userResponse.movie;
						}
						let queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
						movieThis(queryURL);
					});
				break;

			case `do-what-it-says`: doWhatItSays(); break;
			// The default case
			default: console.log(`
														Please type: 'node liri.js' and then type in one of the following:
														my-tweets\n
														spotify-this-song\n
														movie-this\n
														do-what-it-says\n
														Note: if the title is more than one word place quotes ("") around it.  Thanks!
			`)
		};
	});
// Twitter bot stuff

function Tweets() {

	// let twitUsername = process.argv[3];
	// if (!twitUsername) {
	// 	twitUsername = 'Liri_Bots'; console.log("Hey!");
	// }
	// let params = { screen_name: 'Liri_Bots' };
	samsTwitter.get("statuses/user_timeline/", { count: 20 }, function (error, tweets, response) {
		if (!error) {
			for (let i = 0; i < tweets.length; i++) {
				let twitterObj = {};
				twitterObj.name = tweets[i].user.name;
				twitterObj.screenName = tweets[i].user.screen_name
				twitterObj.text = tweets[i].text;
				twitterObj.created = tweets[i].user.created_at;
				twittersToPrint.push(twitterObj);
			}
			console.log(twittersToPrint);
		} else {
			console.log(error);
			return;
		}
	});
}

// Spotify bot stuff
function spotifyCall(title) {
	var mySpotify = new Spotify(keys.spotify);
	// if (!liriArg === "") {
	// 	console.log(liriArg);
	// 	title = liriArg;
	// }
	mySpotify.search({ type: 'track', query: title }, function (err, data) {
		if (err) throw err;
		console.log(title);
		console.log(`
		Song Name: ${data.tracks.items[0].name}
		Artist: ${data.tracks.items[0].artists[0].name}
		Album: ${data.tracks.items[0].album.name}
		Preview Link: ${data.tracks.items[0].album.artists[0].external_urls.spotify}
		`);
	});

	// function spotifyThisSong() {
	// 	let mySpotify = new spotify(keys.spotify);

	// 	mySpotify.search({ type: 'track', query: 'Billie Jean' }, function (err, data) {
	// 		if (err) {
	// 			return console.log('Error occurred: ' + err);
	// 		}
	// 		console.log(`This is the ${data}!`);
	// 	});



	// let songName = process.argv[3];
	// if (!songName) {
	// 	songName = 'Billie Jean';
	// }
	// spotify.search({
	// 	type: 'track', query: songName
	// },
	// 	function (err, data) {
	// 		if (err) {
	// 			return console.log('Error occurred: ' + err);
	// 		}
	// 		console.log(data);
	// 	});
}

// Movie This stuff
function movieThis(queryURL) {
	request(queryURL, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log(`
			The Title:		${ JSON.parse(body).Title}
			The Release Year:	${ JSON.parse(body).Year}
			imdb Rating:		${ JSON.parse(body).imdbRating}
			Rotten Tomatoes:	${ JSON.parse(body).Ratings[1].Value}
			Contry Produced:	${ JSON.parse(body).Country}
			Movie Language:		${ JSON.parse(body).Language}
			The Players:		${ JSON.parse(body).Actors}
			Movie Plot:		${ JSON.parse(body).Plot}
										`);
		} else console.log(`This is the error: ${error}`);
	});

	//  * Title of the movie.
	//  * Year the movie came out.
	//  * IMDB Rating of the movie.
	//  * Rotten Tomatoes Rating of the movie.
	//  * Country where the movie was produced.
	//  * Language of the movie.
	//  * Plot of the movie.
	//  * Actors in the movie.
}