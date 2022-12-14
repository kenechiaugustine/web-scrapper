const axios = require('axios')
const cheerio = require('cheerio')


const url = 'https://nzdworld.com/'
let allMovies = []

module.exports = async function getNzdMovies() {
    // let allMoviesDetails = []

    try {
        await axios(url)
        .then(response => {
            console.log(response.data);
                const html = response.data;
                const $ = cheerio.load(html);
                // loop thru each page movie cards and get single page link
                $('.mh-loop-item', html).each(async function () {
                    let movieDetailsObj = {}
                    // const movieTitle = $(this).find('h3').text();
                    const movieSinglePageLink = $(this).find('a').attr('href')
                    await axios(movieSinglePageLink)
                        .then(response => {
                            const html = response.data;
                            const $ = cheerio.load(html);
                            // get movie name
                            const singlePageMovieTitle = $('.entry-title').text();
                            // get movie download link
                            let downloadLinkArr = []
                            $('p', html).each(function () {
                                const allLinks = $(this).find('a').text();
                                let downloadLink = ''
                                if (allLinks === 'DOWNLOAD MOVIE') {
                                    downloadLink = $(this).find('a').attr('href')
                                    downloadLinkArr.push(downloadLink)
                                }
                                else if (allLinks.indexOf('Episode') !== -1) {
                                    downloadLink = $(this).find('a').attr('href')
                                    downloadLinkArr.push(downloadLink)
                                }
                            })
                            // console.log(`MOVIE: ${singlePageMovieTitle} - LINK: ${downloadLinkArr}`)
                            // Compile every movie and download link with other details of the movie
                            movieDetailsObj = {
                                movieName: singlePageMovieTitle,
                                movieLink: movieSinglePageLink,
                                downloadLinks: downloadLinkArr,
                            }
                            // console.log('yeah yeah yeah')
                        }).catch(err => {
                            console.log('Loading single page error')
                        })
                    allMovies.push(movieDetailsObj);
                    console.log(allMovies)
                })
            }).catch(err => {
                if (err.code === 'ERR_BAD_REQUEST') {
                    console.log('404. Invalid URL')
                }
            })
    } catch (error) {
        console.log('Something went wrong')
    }
}