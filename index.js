const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function findMovies() {
	fetch(`http://www.omdbapi.com/?s=blade runner&apikey=${API_KEY}`)
		.then((res) => res.json())
		.then((data) => {
			console.log(data.Search);

			let foundMovieList = [];

			data.Search.map((movie) => {
				fetch(
					`http://www.omdbapi.com/?i=${movie.imdbID}&plot=short&apikey=${API_KEY}`,
				)
					.then((res) => res.json())
					.then((data) => foundMovieList.push(data));
			});

			console.log(foundMovieList);
		});
}

findMovies();
