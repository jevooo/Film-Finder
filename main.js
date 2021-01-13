var url = 'https://omdbapi.com/?apikey=7e304445&';
var pages = 0;
var currentPage = 1;
var searchTerms = '';

$(document).ready(function() {
    $('#searchForm').submit(function(event) {
        currentPage = 1;
        event.preventDefault();
        searchTerms = $('#searchTerms').val();
        $.ajax({
            method:'GET',
            url: url + "s=" + searchTerms,
            success:function(data){         
                let results = data;
                pages = Math.ceil(results.totalResults / 10);
                let output = '';
                $.each(results.Search, (index, result) => {
                    output += `
                    <div class="col-md-6">
                        <div class="well film text-center">
                            <img src="${result.Poster}">
                            <h5>${result.Title}</h5>
                            <a onclick="movieSelected('${result.imdbID}')" class="btn btn-info" href="#">Details</a>
                        </div>
                    </div>
                    `;
                }); 
                let pagination = `
                <nav>
                    <ul class="pagination">
                        <li class="page-item">
                            <a class="page-link" onclick="changePage(false)">
                                <span>&laquo; Prev</span>
                            </a>
                        </li>
                        <li class="page-item">
                            <a class="page-link" onclick="changePage(true)">
                                <span>Next &raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <p id="pageNumber"><em>Page ${currentPage} out of ${pages}</em></p>
                  `;
                $('#results').html(output);
                $('#pages').html(pagination);

            }
        });
    });
});

function movieSelected(movieId) {
    sessionStorage.setItem('movieId', movieId);
    window.location = 'movie.html';
    return false;
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');
    $.ajax({
        method:'GET',
        url: url + "i=" + movieId,
        success:function(data) {
            let movie = data;
            let output = `
                <div class="row">
                    <div class="col-md-6">
                    <img src="${movie.Poster}" class>
                    </div>
                    <div class="col-md-8">
                    <h2>${movie.Title}</h2>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                        <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                        <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                        <li class="list-group-item"><strong>IMDB Score:</strong> ${movie.imdbRating}</li>
                        <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                        <li class="list-group-item"><strong>Cast:</strong> ${movie.Actors}</li>
                        <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                    </ul>
                    </div>
                </div>
                <div class="row>
                    <div class="well">
                        <hr>
                        <h3>Plot</h3>
                        ${movie.Plot}
                        <hr>
                        <button onclick="window.history.back()" class="btn btn-info">&laquo Go back</button>
                    </div>
                </div>
            `;
            $('#movie').html(output);
        }
    });
    return;
}

function changePage(bool) {
    if (bool){
        if (pages != currentPage) {
            currentPage++;
            $.ajax({
                method: 'GET',
                url: url + 's=' + searchTerms + '&page=' + currentPage,
                success:function(data) {                 
                    let results = data;
                    let output = '';
                    $.each(results.Search, (index, result) => {
                        output += `
                        <div class="col-md-6">
                            <div class="well film text-center">
                                <img src="${result.Poster}">
                                <h5>${result.Title}</h5>
                                <a onclick="movieSelected('${result.imdbID}')" class="btn btn-info" href="#">Details</a>
                            </div>
                        </div>
                        `;
                    });
                    document.body.scrollTop = 0; 
                    document.documentElement.scrollTop = 0;
                    $('#pageNumber').html(`<p id="pageNumber"><i>Page ${currentPage} out of ${pages}</i></p>`);
                    $('#results').html(output);
                }
            });
        }
    }
    else if (!bool){
        if (currentPage != 1) {
            currentPage--;
            $.ajax({
                method: 'GET',
                url: url + 's=' + searchTerms + '&page=' + currentPage,
                success:function(data) {           
                    let results = data;
                    let output = '';
                    $.each(results.Search, (index, result) => {
                        output += `
                        <div class="col-md-6">
                            <div class="well text-center">
                                <img src="${result.Poster}">
                                <h5>${result.Title}</h5>
                                <a onclick="movieSelected('${result.imdbID}')" class="btn btn-info" href="#">Details</a>
                            </div>
                        </div>
                        `;
                    });
                    document.body.scrollTop = 0; 
                    document.documentElement.scrollTop = 0;
                    $('#pageNumber').html(`<p id="pageNumber"><i>Page ${currentPage} out of ${pages}</i></p>`);
                    $('#results').html(output);
                }
            });
        }
    }
}
