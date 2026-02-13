const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const searchForm = document.getElementById("search-form");

document.querySelector("form").addEventListener("submit", (e) => {
	e.preventDefault();

	let html = "";
	const searchValue = document.querySelector('input[type="text"]').value;

	findMovies(searchValue);
});

function findMovies(searchvalue) {
	fetch(`http://www.omdbapi.com/?s=${searchvalue}&apikey=${API_KEY}`)
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			return res.json();
		})
		.then((data) => {
			// Check if the API returned an error (e.g., no movies found)
			if (data.Response === "False") {
				console.error("Error:", data.Error);
				return;
			}

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
		})
		.catch((error) => {
			console.error("Error fetching movies:", error);
		});
}
