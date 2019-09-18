const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios')
const slugify = require('slugify')
const download = require('image-downloader')

const ITEMS_URL = 'https://mobilelegendsbangbang.com/items/'

async function getItemsHtmlClearer() {
  // https://mobile-legends.fandom.com/wiki/Gear
  const html = fs.readFileSync('items2.html', 'utf8')
  return html
}

async function getItemsHtml() {
  // const html = await axios.get(ITEMS_URL)
  const html = fs.readFileSync('items.html', 'utf8')
  return html
}

async function getHeroesHtml() {
  const html = fs.readFileSync('heroes.html', 'utf8')
  return html
}

async function saveItemImages () {
  const itemsHtml = await getItemsHtml()
  const $ = cheerio.load(itemsHtml)

  const $items = $('.gear-summary')
  $items.each((index, item) => {
    const imageUrl = item.children[1].attribs.src
    const itemName = item.children[3].children[0].data
    console.log(imageUrl, itemName)

    download.image({
      url: imageUrl,
      dest: `./img/items/${itemName}.png`
    }).then(({ filename }) => {
      console.log(`Saved ${itemName}`)
    }).catch((err) => console.log(err, itemName))
  })
}

async function saveItemImagesClearer () {
  const itemsHtml = await getItemsHtmlClearer()
  const $ = cheerio.load(itemsHtml)

  const $items = $('.image.image-thumbnail.link-external')
  const item = $items[0]
  const imageUrl = item.children[0].attribs.src

  // const itemName = item.parent.parent.parent.children[5].children[0].children[0].data
  // console.log(itemName)
  // return

  $items.each((index, item) => {
    console.log(index)
    const imageUrl = item.children[0].attribs.src
    const itemName = $(item.parent.parent).next('p').children('a').text()
    // const itemName = item.parent.parent.parent.children[5].children[0].children[0].data
    console.log(imageUrl, itemName)

    if(itemName == '') {
      console.log('No name', index)
      return
    }

    if(imageUrl == '') {
      console.log('No image url', index, itemName)
      return
    }

    download.image({
      url: imageUrl,
      dest: `./img/items-hd/${itemName}.png`
    }).then(({ filename }) => {
      console.log(`Saved ${itemName}`)
    }).catch((err) => console.log(err, itemName, index))
  })
}

async function saveHeroImages() {
  const heroesHtml = await getHeroesHtml()
  const $ = cheerio.load(heroesHtml)

  const $heroes = $('.ml-img.ml-round.hero-img')
  $heroes.each((index, hero) => {
    const imageUrl = hero.children[0].children[0].attribs.src
    const heroName = hero.children[0].attribs.title
    download.image({
      url: imageUrl,
      dest: `./img/heroes/${heroName}.png`
    }).then(({ filename }) => {
      console.log(`Saved ${heroName}`)
    }).catch((err) => console.log(err, heroName))
    console.log(imageUrl)
    console.log(heroName)
    console.log('---')
  })
}

// saveItemImages()
saveItemImagesClearer()
// saveHeroImages()