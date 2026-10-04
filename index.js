// APIs:

// usage: https://www.omdbapi.com/
// my apikey=68910135
// API sample: "https://www.omdbapi.com/?apikey=68910135&s=chronicles"

// get design from https://dev.d24jig8s1lr7n9.amplifyapp.com/findyourcar

/*
REQUIREMENTS:
[x] The top has a search bar with a search buton. When you press Enter or the search button, it will search for movies with the title you entered and display them in cards below.
[x] Show the first 6 movies that match the search term. If there are more than 6, show a "Load More" button that will load the next 6 movies.
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
let movies = null;

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

/*
/***************************************************************
 * Basic flow: 
 * 1. Get the books selector
 * 2. Add the loading state to the selector
 * 3. Await the promise to get the books
 * 4. Remove the loading state
 * 5. switch the possible values and use the Array.sort()
 * 6. map array values to html then join to get rid of the array commas. 
 ***************************************************************

async function renderBooks(filter)
{
  const booksWrapper = document.querySelector(".books");

  booksWrapper.classList += " books__loading";
  if( !books ) {
    books = await getBooks();
  }
  booksWrapper.classList.remove("books__loading");

  console.log("renderBooks() wrapper = ", booksWrapper, "books = ", books);
  let priceOrg = 0;
  let priceSale = 0;
  let isSale = false;
  let filteredBooks = books;

    // Implement the filtering logic based on the selected value
  switch (filter) {
    case "LOW_TO_HIGH":
      // Implement low to high price filtering
      console.log("Filtering books from low to high price");
      filteredBooks = books.sort((a, b) => (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice));
      break;
    case "HIGH_TO_LOW":
      // Implement high to low price filtering
      console.log("Filtering books from high to low price");
      filteredBooks = books.sort((a, b) => (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice));
      break;
    case "RATING":
      // Implement rating filtering
      console.log("Filtering books by rating");
      filteredBooks = books.sort((a, b) => b.rating - a.rating);
      break;
  }

  const booksHtml = filteredBooks.map( (book) => {
    isSale = !!book.salePrice;
    priceOrg = book.originalPrice.toFixed(2);
    priceSale = (isSale) ? book.salePrice.toFixed(2) : priceOrg;
    return `<div class="book">
      <figure class="book__img--wrapper">
        <img src="${book.url}" alt="" class="book__title">
      </figure>
      <div class="book__title">
        ${book.title}
      </div>` +
      `<div class="book__ratings">
        ${ratingToHtml(book.rating)}
      </div>` + 
      `<div class="book__price">` + 
        priceToHtml(isSale, priceOrg, priceSale) + 
      `</div></div>`;
  });

    // Each element is separated by a comma that shows up visually. So return a
    // new array with the booksHtml strings joined together
    booksWrapper.innerHTML = booksHtml.join("");
}

*/


/**************************************************************************
 * The main "meat" of the page
 *************************************************************************/
function renderCards(movies) {
    console.log(`function renderCards(${movies})`);
    let moviesHtmlTemp = "";
    moviesHtmlShort = "";
    moviesHtmlFull = "";
    const noPoster = './assets/no-poster02.jpg';

  /*
    value="TITLE_LOW_TO_HIGH"
    value="TITLE_HIGH_TO_LOW"
    value="DATE_LOW_TO_HIGH"
    value="DATE_LOW_TO_HIGH"
  */

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
        //console.log("renderCards() moviesToLoad = ", moviesToLoad);
        moviesHtmlFull += moviesHtmlTemp;   //  Always add temp HTML to the full movies list

        if( moviesToLoad >= 0 ) {
            moviesHtmlShort += moviesHtmlTemp;  //  Stop adding moview to the short movies list.
        }
    }
    document.querySelector(".movie-cards").innerHTML = moviesHtmlShort;
}

/**************************************************************************
 * This is called from the HTML UI with the filter control onChange handler.
 *************************************************************************/
function filterMovies(e)
{
    const value = e.target.value;
  console.log(`filterMovies(${value})`);

  renderCards(value);
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

    console.log(movies);

    /* Response can be "True" or "False". If "False", console log the error message
     * and throw an error with the message "Movie not found!". if "True", console log
     * the first movie in the Search array and call the renderCards function with
     * the Search array as an argument. */
    try {
        if (movies.Response === "False") {
            throw new Error("Movie not found!");
        }
        console.log(movies.Search[0]);
        moviesContainer.classList.remove("movies__loading");
        console.log("removing spinner");
        renderCards(movies.Search);
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
async function main() {   
    const btn = document.querySelector('.header__search--btn');

    /* Initiate the search and render sequence:
     * 1. Fake a button click in the "search" field
     * 2. onSearchSubmit(event) with default value "chronicles"
     * 3. fetchMovies(searchTerm)
     * 4. renderCards(searchTerm)
     */
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
