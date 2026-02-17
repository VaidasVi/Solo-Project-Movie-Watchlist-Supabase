// Supabase integration
import { supabase } from "./supabase.js";

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
		// Show loading - recreate the loading div if needed
		resultContainer.innerHTML = `
			<div id="loading" style="display: block;">
				<p>Loading...</p>
			</div>
		`;

		const loading = document.getElementById("loading");

		const res = await fetch(
			`https://www.omdbapi.com/?s=${searchvalue}&apikey=${API_KEY}`,
		);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data = await res.json();

		// Check if the API returned an error (e.g., no movies found)
		if (data.Response === "False") {
			console.error("Error:", data.Error);
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
				`https://www.omdbapi.com/?i=${movie.imdbID}&plot=short&apikey=${API_KEY}`,
			);
			const movieData = await movieRes.json();
			foundMovieList.push(movieData);
		}

		console.log(foundMovieList);

		let html = "";

		foundMovieList.forEach((card, index) => {
			html += `
				<div class="result-card">
					<img
						src="${card.Poster}"
						alt="${card.Title} poster"
						class="poster"
					/>
					<h2>${card.Title}</h2>
					<div class="rating">
						<i class="fa fa-star" aria-hidden="true"></i>
						<span>${card.imdbRating}</span>
					</div>
					<div class="info-container">
						<p>${card.Runtime}</p>
						<p>${card.Genre}</p>
						<button class="add-to-watchlist-btn" data-index="${index}">
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

		// Add event listeners to all watchlist buttons
		const watchlistButtons = document.querySelectorAll(".add-to-watchlist-btn");
		watchlistButtons.forEach((button) => {
			button.addEventListener("click", async () => {
				const index = button.getAttribute("data-index");
				const movie = foundMovieList[index];
				addToWatchlist(movie, button);
			});
		});
	} catch (error) {
		console.error("Error fetching movies:", error);
		const loading = document.getElementById("loading");
		if (loading) {
			loading.style.display = "none";
		}
	}
}

async function addToWatchlist(movieData, button) {
	// Disable button and show loading state
	button.disabled = true;
	const originalText = button.innerHTML;
	button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Adding...';

	try {
		// Check if movie already exists in Supabase
		const { data: existingMovie, error: checkError } = await supabase
			.from("watchlist")
			.select("*")
			.eq("imdb_id", movieData.imdbID)
			.single();

		if (existingMovie) {
			alert("Movie already in watchlist!");
			button.innerHTML = originalText;
			button.disabled = false;
			return;
		}

		// Insert movie into Supabase
		const { data, error } = await supabase.from("watchlist").insert([
			{
				imdb_id: movieData.imdbID,
				title: movieData.Title,
				poster: movieData.Poster,
				rating: movieData.imdbRating,
				runtime: movieData.Runtime,
				genre: movieData.Genre,
				plot: movieData.Plot,
			},
		]);

		if (error) {
			throw error;
		}

		// Success - update button to show it's added
		button.innerHTML = '<i class="fa fa-check-circle"></i> Added!';
		setTimeout(() => {
			button.innerHTML = originalText;
			button.disabled = false;
		}, 2000);
	} catch (error) {
		console.error("Error adding to watchlist:", error);
		alert("Failed to add movie to watchlist. Please try again.");
		button.innerHTML = originalText;
		button.disabled = false;
	}
}
