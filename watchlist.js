import { supabase } from "./supabase.js";

const watchlistContainer = document.getElementById("watchlist-container");
const loading = document.getElementById("loading");
const emptyState = document.querySelector(".empty-state");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Load watchlist when page loads
window.addEventListener("DOMContentLoaded", () => {
	loadWatchlist();
});

async function loadWatchlist() {
	try {
		// Show loading state
		watchlistContainer.innerHTML = `
			<div id="loading" style="display: block">
				<p>Loading...</p>
			</div>
		`;

		// Get watchlist from Supabase
		const { data: watchlist, error } = await supabase
			.from("watchlist")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			throw error;
		}

		// Show empty state if no movies
		if (!watchlist || watchlist.length === 0) {
			watchlistContainer.innerHTML = `
				<div id="loading" style="display: none">
					<p>Loading...</p>
				</div>
				<div class="empty-state">
					<p class="empty-title">Your watchlist is looking a little empty...</p>
					<a href="index.html" class="add-movies-btn">
						<i class="fa fa-plus-circle" aria-hidden="true"></i>
						Let's add some movies!
					</a>
				</div>
			`;
			return;
		}

		// Display movies
		displayWatchlist(watchlist);
	} catch (error) {
		console.error("Error loading watchlist:", error);
		alert("Failed to load watchlist: " + error.message);
	}
}

function displayWatchlist(movies) {
	let html = "";

	movies.forEach((movie) => {
		html += `
			<div class="result-card">
				<img
					src="${movie.poster}"
					alt="${movie.title} poster"
					class="poster"
				/>
				<h2>${movie.title}</h2>
				<div class="rating">
					<i class="fa fa-star" aria-hidden="true"></i>
					<span>${movie.rating}</span>
				</div>
				<div class="info-container">
					<p>${movie.runtime}</p>
					<p>${movie.genre}</p>
					<button class="remove-btn" data-imdb="${movie.imdb_id}" data-id="${movie.id}">
						<i class="fa fa-minus-circle" aria-hidden="true"></i>
						Remove
					</button>
				</div>
				<p>${movie.plot}</p>
			</div>
		`;
	});

	watchlistContainer.innerHTML = html;

	// Add event listeners to remove buttons
	const removeButtons = document.querySelectorAll(".remove-btn");
	removeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const id = button.getAttribute("data-id");
			removeFromWatchlist(id);
		});
	});
}

async function removeFromWatchlist(id) {
	try {
		// Delete from Supabase
		const { error } = await supabase.from("watchlist").delete().eq("id", id);

		if (error) {
			throw error;
		}

		// Reload watchlist display
		loadWatchlist();
	} catch (error) {
		console.error("Error removing from watchlist:", error);
		alert("Failed to remove from watchlist: " + error.message);
	}
}

searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const searchTerm = searchInput.value.trim();

	if (!searchTerm) {
		loadWatchlist(); // Show all if empty
	} else {
		searchWatchlist(searchTerm);
	}
});

async function searchWatchlist(searchTerm) {
	try {
		// Get all watchlist from Supabase
		const { data: watchlist, error } = await supabase
			.from("watchlist")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			throw error;
		}

		const term = searchTerm.toLowerCase();

		// Filter movies that match
		const results = watchlist.filter((movie) => {
			return (
				movie.title.toLowerCase().includes(term) ||
				movie.genre.toLowerCase().includes(term) ||
				movie.plot.toLowerCase().includes(term)
			);
		});

		if (results.length === 0) {
			watchlistContainer.innerHTML = `
        <div class="empty-state">
          <p class="empty-title">No movies found for "${searchTerm}"</p>
          <button class="show-all-btn add-movies-btn">
            Show all movies
          </button>
        </div>
      `;

			// Add event listener to "Show all movies" button
			const showAllBtn = document.querySelector(".show-all-btn");
			if (showAllBtn) {
				showAllBtn.addEventListener("click", () => {
					searchInput.value = ""; // Clear search input
					loadWatchlist();
				});
			}
		} else {
			displayWatchlist(results);
		}
	} catch (error) {
		console.error("Error searching watchlist:", error);
		alert("Failed to search watchlist: " + error.message);
	}
}
