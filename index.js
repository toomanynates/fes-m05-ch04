// APIs:

// usage: https://www.omdbapi.com/
// my apikey=68910135
// API sample: "https://www.omdbapi.com/?apikey=68910135&s=chronicles"

// get design from https://dev.d24jig8s1lr7n9.amplifyapp.com/findyourcar

/*
REQUIREMENTS:
[x] The top has a search bar with a search buton. When you press Enter or the search button, it will search for movies with the title you entered and display them in cards below.
[ ] Show the first 6 movies that match the search term. If there are more than 6, show a "Load More" button that will load the next 6 movies.
[ ] Add a loading state while awaiting the API fetch
*/

/*
RESOURCES:
- m05-ch01 has the nav underline animations, the dark/light contrast button, the animating Contact form, the onMouseMove animating elements, the blurring projects with the description overlay, the fixed position email button.
- m05-L02 has the loading state and the sort for the books.
- m03-l03 final project has the header nav spacing, and an email input box i can use. Also a mobile hamburger menu. Not the one in the fes-website - the standalone one.
*/

let moviesHtmlShort = "";
let moviesHtmlFull = "";

// Listen for the Enter key and then call the onSearchSubmit function
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.header__search--input');
    searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        onSearchSubmit(event);
    }
    });
});


function openPage(id) {
// open new page with the movie details
    window.open(`https://www.imdb.com/title/${id}/`, "_blank");
}


function renderCards(movies) {
    console.log(movies);
    let moviesHtmlTemp = "";
    moviesHtmlShort = "";
    moviesHtmlFull = "";
    const noPoster = './assets/no-poster02.jpg';

    let moviesToLoad = 6;

    for (const movie of movies) {
        moviesHtmlTemp = `
        <div class="movie-card">
            <img class="movie-card__bg-img" src="${movie.Poster}}" onerror="this.src=''">
            <div class="movie-card__container">
                <div class="movie-card__title">${movie.Title}</div>
                <img class="movie-card__img"
                     src="${movie.Poster}}"
                     onerror="this.src='${noPoster}'"
                     alt="Movie Poster">
                <ul class="movie-card__details">
                <li class="movie-card__detail"><b>Type</b> ${movie.Type}</li>
                <li class="movie-card__detail"><b>Year</b> ${movie.Year}</li>
                <li class="movie-card__detail"><b>imdbID</b> <a href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">${movie.imdbID}</a></li>
                </ul>
            </div>
        </div>
        `;

        //  Add moviesHtmlTemp to the appropriate list
        moviesToLoad--;
        console.log("renderCards() moviesToLoad = ", moviesToLoad);
        moviesHtmlFull += moviesHtmlTemp;   //  Always add temp HTML to the full movies list

        if( moviesToLoad >= 0 ) {
            moviesHtmlShort += moviesHtmlTemp;  //  Stop adding moview to the short movies list.
        }
    }
    document.querySelector(".movie-cards").innerHTML = moviesHtmlShort;
}

async function fetchMovies(searchTerm) {
    const response = await fetch("https://www.omdbapi.com/?apikey=68910135&s=" + searchTerm);
    const data = await response.json();

    console.log(data);

    /* Response can be "True" or "False". If "False", console log the error message and throw an error with the message "Movie not found!".
    if "True", console log the first movie in the Search array and call the renderCards function with the Search array as an argument.
    */
    try {
        if (data.Response === "False") {
            throw new Error("Movie not found!");
        }
        console.log(data.Search[0]);
        renderCards(data.Search);
    } catch (error) {
        console.error(error.message);
    }
}

// apply the search term
function onSearchSubmit(event) {
    event.preventDefault();

    // Grab the value from the html element
    const searchInput = document.querySelector('.header__search--input');
    const searchTerm = searchInput.value.trim();

    console.log('Search submitted with term:', searchTerm);

    // Fetch and display movies based on the search term
    if (searchTerm) {
        fetchMovies(searchTerm);
    }

    showLoadMoreButton(true);
}

function showLoadMoreButton(bShow)
{
    console.log("showLoadMoreButton(" + bShow + ")");
    document.querySelector(".more__btn").classList.toggle("hidden", !bShow);
}

function loadMoreClicked()
{
    console.log("loadMoreClicked()")

    // the renderCards() function should have already formatted the full
    // movie list by now. Just add it to the movie-cards.
    document.querySelector(".movie-cards").innerHTML = moviesHtmlFull;

    //  hide the button since it's been clicked. 
    showLoadMoreButton(false);
}



// fire up
async function main() {   
    const btn = document.querySelector('.header__search--btn');

    btn.click();

    /* I used to have this but I wanted to replace it with the existing mechanisms so as not to repeat functionality

    // search for default info
    const response = await fetch("https://www.omdbapi.com/?apikey=68910135&s=chronicles");
    const data = await response.json();

    //console.log(data);
    //console.log(data.Search[0]);

    renderCards(data.Search);
    */
}

main();
