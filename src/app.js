const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3030

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


// Define paths for Express Config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ian Lombu'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ian Lombu'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Thankyou',
        title: 'Help',
        name: 'Ian Lombu'
    })
})

/*
==== QUERY STRING ====
app.get('/weather', (req, res) => { 
    if(!req.query.address) {
        return res.send({
            error: 'Please Check Again'
        })
    }
    console.log(req.query.address);
    res.send({
        location: req.query.address
    })
})
*/

app.get('/weather', (req, res) => {
    if(!req.query.address) {
         return res.send({
            error: 'Please provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData  ) => {
            if(error) {
                return res.send({ error });
            }
            console.log(location);
            console.log(forecastData);
            res.send({
                location: location,
                forecastData: forecastData,
                address: req.query.address
            })
        })
    })

})


app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search);
    res.send({
        products: []
    })
})


app.get('/help/*', (req, res) => {
    res.render('error_page', {
        title: '404',
        name: 'Ian Lombu',
        errorMessage: 'Help Article Not Found'
    })
})

app.get('*', (req, res) => {
    res.render('error_page', {
        title: '404',
        name: 'Ian Lombu',
        errorMessage: 'Page Not Found'
    })
})


app.listen(port, () => {
    console.log('Server is up on port : ' + port);
})