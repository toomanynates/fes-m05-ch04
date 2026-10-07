// APIs:
// usage: https://www.omdbapi.com/
// get design from https://dev.d24jig8s1lr7n9.amplifyapp.com/findyourcar

/*
REQUIREMENTS:
[x] The top has a search bar with a search buton. When you press Enter or the search button,
    it will search for movies with the title you entered and display them in cards below.
[x] Show the first 6 movies that match the search term. If there are more than 6, show a
    "Load More" button that will load the next 6 movies.
[X] Add a loading state while awaiting the API fetch
[X] Add a filter control to sort the movies by title or year, ascending or descending.
*/

let moviesHtmlShort = "";
let moviesHtmlFull = "";
let movies = null;
let sort = "TITLE_LOW_TO_HIGH";

/**************************************************************************
 * Listen for the Enter key and then call the onSearchSubmit function
 *************************************************************************/
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.header__search--input');
    searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        onSearchSubmit(event);
    }
    });
});


/**************************************************************************
 * onclick handler when user clicks the imdbID link
 *************************************************************************/
function openPage(id) {
// open new page with the movie details
    window.open(`https://www.imdb.com/title/${id}/`, "_blank");
}


/**************************************************************************
 * scroll the page to the top when the user clicks the Film Finer icon
 * at the bottom of the page in the footer.
 *************************************************************************/
function scrollToTop() {
    window.scrollTo({top: 0});
}


/**************************************************************************
 * When the user clicks the contrast light/dark icon in the upper nav.
 *************************************************************************/
function onClickDarkTheme() {
  let body = document.querySelector('body');  
  console.log("onClickDarkTheme() " + body.style.classList);
  body.classList.toggle('dark-theme');
}

/**************************************************************************
 * The main "meat" of the page
 *************************************************************************/
function renderCards(movies) {
//    console.log(`function renderCards(${movies})`);
    const noPoster = './assets/no-poster02.jpg';
    let moviesToLoad = 6;
    let moviesHtmlTemp = "";

    moviesHtmlShort = "";
    moviesHtmlFull = "";

    for (const movie of movies)
    {
        moviesHtmlTemp = 
            `<div class="movie-card">
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
            </div>`;

        moviesToLoad--;
        moviesHtmlFull += moviesHtmlTemp;   //  Always add temp HTML to the full movies list

        if( moviesToLoad >= 0 ) {
            moviesHtmlShort += moviesHtmlTemp;  //  Stop adding moview to the short movies list.
        }
    }

    document.querySelector(".movie-cards").innerHTML = moviesHtmlShort;
}

/* This takes a filter string and returns a sorted array of movies.
 * It is called from the onChangeFilter() function and from fetchMovies().
 */
function sortMovies(strFilter)
{
    console.log(`sortMovies(${strFilter})`)

    // if no movies or movies.search is null, return an empty array and send a console log message
    if( !movies || !movies.Search ) {
        console.log("sortMovies() movies or movies.Search is null");
        return [];
    }

    const moviesData = movies.Search;
    let sortedMovies = "";
    sort = strFilter;

    console.log(`sortMovies(${strFilter}) moviesData = ${moviesData}`);
    showLoadMoreButton(true);

    // Sort the array data
    switch (sort) {
    case "TITLE_HIGH_TO_LOW":
        // Implement high to low title filtering
        console.log("Filtering movies from high to low title");
        sortedMovies = moviesData.sort((a, b) => b.Title.localeCompare(a.Title));
        break;
    case "DATE_HIGH_TO_LOW":
        // Implement high to low date filtering
        console.log("Filtering movies from high to low date");
        sortedMovies = moviesData.sort((a, b) => b.Year.localeCompare(a.Year));
        break;
    case "DATE_LOW_TO_HIGH":
        // Implement date filtering
        console.log("Filtering movies by date");
        sortedMovies = moviesData.sort((a, b) => a.Year.localeCompare(b.Year));
        break;
    default:
        // Implement low to high title filtering
        console.log("Filtering movies from low to high title");
        sortedMovies = moviesData.sort((a, b) => a.Title.localeCompare(b.Title));
        break;
    };

    console.log("sortMovies() sortedMovies = ", sortedMovies);
    return sortedMovies;

}


/**************************************************************************
 * This is called from the HTML UI with the filter control onChange handler.
 *************************************************************************/
function onChangeFilter(e)
{
  let sortedMovies = sortMovies(e.target.value);
  renderCards(sortedMovies);
}


/**************************************************************************
 * async function to get the movie json data. 
 *************************************************************************/
async function fetchMovies(searchTerm) {
    // Start the spinner to show that something is loading.
    const moviesContainer = document.querySelector(".movie-cards");

    // Handle the loading state "spinner" icon. First clear out any movies
    // and replace with spinner icon.
    moviesContainer.innerHTML = '<i class="fa-solid fa-spinner movies__loading"></i>';
    moviesContainer.classList += " movies__loading";
    console.log("engaging spinner");
    
    // try to get movie data
    const response = await fetch("https://www.omdbapi.com/?apikey=68910135&s=" + searchTerm);
    movies = await response.json();

    console.log("fetchMovies() movies = ", movies);

    /* Response can be "True" or "False". If "False", console log the error message
     * and throw an error with the message "Movie not found!". if "True", console log
     * the first movie in the Search array and call the renderCards function with
     * the Search array as an argument. */

    try {
        if (movies.Response === "False") {
            throw new Error("Movie not found!");
        }
        moviesContainer.classList.remove("movies__loading");
        console.log("removing spinner");
        console.log("fetchMovies() movies before sort = ", movies)
        let sortedMovies = sortMovies(sort);
        console.log("fetchMovies() movies after sort = ", sortedMovies)
        renderCards(sortedMovies);
    } catch (error) {
        console.error(error.message);
    }

}

/**************************************************************************
 * Apply the search term
 *************************************************************************/
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


/**************************************************************************
 * visibility toggle for the "Load More Movies" button. It goes away
 * after is is pressed. After a new search term, it gets toggled on again.
 *************************************************************************/
function showLoadMoreButton(bShow)
{
    console.log("showLoadMoreButton(" + bShow + ")");
    document.querySelector(".more__btn").classList.toggle("hidden", !bShow);
}


/**************************************************************************
 * onclick handler for the "Load More Movies"
 *************************************************************************/
function loadMoreClicked()
{
    console.log("loadMoreClicked()")

    // the renderCards() function should have already formatted the full
    // movie list by now. Just add it to the movie-cards.
    document.querySelector(".movie-cards").innerHTML = moviesHtmlFull;

    //  hide the button since it's been clicked. 
    showLoadMoreButton(false);
}



/**************************************************************************
 * Fire up the engine for the page
 *************************************************************************/
function main() {   
    const btn = document.querySelector('.header__search--btn');

    /* Initiate the search and render sequence:
     * 1. Fake a button click in the "search" field
     * 2. onSearchSubmit(event) with default value "chronicles"
     * 3. fetchMovies(searchTerm)
     * 4. renderCards(searchTerm)
     */
    btn.click();
}

main();
