const PORT = process.env.PORT || 8888
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'pewresearch',
        address: 'https://www.pewresearch.org/topic/politics-policy/us-elections-voters/election-2024/',
        base: ''
    },
    {
        name: 'apnews',
        address: 'https://apnews.com/hub/election-2024',
        base: ''
    },
    {
        name: 'abcnews',
        address: 'https://abcnews.go.com/Elections',
        base: ''
    },
    {
        name: 'san',
        address: 'https://san.com/tags/2024-elections/',
        base: ''
    },
    {
        name: 'nbcnews',
        address: 'https://www.nbcnews.com/politics/2024-presidential-election',
        base: ''
    },
    {
        name: 'univision',
        address: 'https://www.univision.com/univision-news/politics',
        base: ''
    },
    {
        name: 'aljazeera',
        address: 'https://www.aljazeera.com/tag/us-election-2024/',
        base: 'https://www.aljazeera.com'
    },
    {
        name: 'news.com.au',
        address: 'https://www.news.com.au/world/north-america/us-politics',
        base: ''
    },
    {
        name: 'newsweek',
        address: 'https://www.newsweek.com/politics',
        base: 'https://www.newsweek.com'
    },
    {
        name: 'npr',
        address: 'https://www.npr.org/sections/elections/',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html)

            $('a:contains("Biden"), a:contains("Trump"), a:contains("Palmer"), a:contains("Uygur"), a:contains("williamson"), a:contains("Haley"), a:contains("DeSantis"), a:contains("Ramaswamy")', html).each(function () {
                const title = $(this).text().replace(/[\n\t]+/g, ' ').trim();
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        }).catch(err => console.log(err))
});

app.get('/', (req, res) => {
    res.json('Welcome to my US Political Election News API');
  })

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].base

    axios.get(newspaperAddress)
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("Biden"), a:contains("Trump"), a:contains("Palmer"), a:contains("Uygur"), a:contains("williamson"), a:contains("Haley"), a:contains("DeSantis"), a:contains("Ramaswamy")', html).each(function () {
            const title = $(this).text().replace(/[\n\t]+/g, ' ').trim();
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperAddress + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))