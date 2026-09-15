// APIs:

// usage: https://www.omdbapi.com/
// my apikey=68910135
// API sample: "https://www.omdbapi.com/?apikey=68910135&s=chronicles"

// get design from https://dev.d24jig8s1lr7n9.amplifyapp.com/findyourcar

/*
REQUIREMENTS:
- The top has a search bar with a search buton. When you press Enter or the search button, it will search for movies with the title you entered and display them in cards below.
- Show the first 6 movies that match the search term. If there are more than 6, show a "Load More" button that will load the next 6 movies.
- Add a loading state while awaiting the API fetch
*/

/*
RESOURCES:
- m05-ch01 has the nav underline animations, the dark/light contrast button, the animating Contact form, the onMouseMove animating elements, the blurring projects with the description overlay, the fixed position email button.
- m05-L02 has the loading state and the sort for the books.
- m03-l03 final project has the header nav spacing, and an email input box i can use. Also a mobile hamburger menu. Not the one in the fes-website - the standalone one.
*/

function openPage(id) {
// open new page with the movie details
    window.open(`https://www.imdb.com/title/${id}/`, "_blank");
  


}

function renderCards(movies) {
    console.log(movies);
    let moviesHtml = "";
    for (const movie of movies) {
        moviesHtml += `
        <div class="movie-card")">
            <div class="movie-card__container">
                <h3>${movie.Title}</h3>
                <img class="movie-card__image" src="${movie.Poster}}" alt="Movie Poster">
                <p><b>Type:</b> ${movie.Type}</p>
                <p><b>Year:</b> ${movie.Year}</p>
                <p><b>imdbID: </b> <a href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">${movie.imdbID}</a></p>
            </div>
        </div>
        `;
    }
    document.querySelector(".movie-cards").innerHTML = moviesHtml;
}

// fire up
async function main() {   
    const response = await fetch("https://www.omdbapi.com/?apikey=68910135&s=chronicles");
    const data = await response.json();

    //console.log(data);
    //console.log(data.Search[0]);

    renderCards(data.Search);
}

main();
