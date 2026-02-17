const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const searchForm = document.getElementById("search-form");
const resultContainer = document.getElementById("result-container");
const emptyState = document.querySelector(".empty-state");

document.querySelector("form").addEventListener("submit", (e) => {
	e.preventDefault();

	const searchValue = document.querySelector('input[type="text"]').value;

	findMovies(searchValue);
});

async function findMovies(searchvalue) {
	try {
		// Show loading
		const loading = document.getElementById("loading");
		loading.style.display = "block";
		if (emptyState) {
			emptyState.style.display = "none";
		}

		const res = await fetch(
			`http://www.omdbapi.com/?s=${searchvalue}&apikey=${API_KEY}`,
		);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data = await res.json();

		// Check if the API returned an error (e.g., no movies found)
		if (data.Response === "False") {
			console.error("Error:", data.Error);
			loading.style.display = "none";
			resultContainer.innerHTML = `
				<div class="empty-state">
					<p id="search-error">Unable to find what you're looking for. Please try another search.</p>
				</div>
			`;
			return;
		}

		// Fetch movie details one by one
		const foundMovieList = [];

		for (const movie of data.Search) {
			const movieRes = await fetch(
				`http://www.omdbapi.com/?i=${movie.imdbID}&plot=short&apikey=${API_KEY}`,
			);
			const movieData = await movieRes.json();
			foundMovieList.push(movieData);
		}

		console.log(foundMovieList);

		let html = "";

		foundMovieList.forEach((card) => {
			html += `
				<div id="result-card">
					<img
						src="${card.Poster}"
						alt="${card.Title} poster"
						id="poster"
					/>
					<h2>${card.Title}</h2>
					<div id="rating">
						<i class="fa fa-star" aria-hidden="true"></i>
						<span>${card.imdbRating}</span>
					</div>
					<div id="info-container">
						<p>${card.Runtime}</p>
						<p>${card.Genre}</p>
						<button>
							<i
								class="fa fa-plus-circle"
								aria-hidden="true"
							></i>
							Watchlist
						</button>
					</div>
					<p>${card.Plot}</p>
				</div>
			`;
		});

		resultContainer.innerHTML = html;
		loading.style.display = "none";
	} catch (error) {
		console.error("Error fetching movies:", error);
		const loading = document.getElementById("loading");
		if (loading) {
			loading.style.display = "none";
		}
	}
}
