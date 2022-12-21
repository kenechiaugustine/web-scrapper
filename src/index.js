const { response } = require('express')
const app = require('express')()

// Scripts
const getNzdMovies = require('./scripts/nzdworld')

// ////////////////////////////////////////////////////////////////
// (async function smth{
// })()

getNzdMovies()
app.get('/nzd', async function (req, res) {
    res.send("DONE!!!")
})


const PORT = 2121
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))