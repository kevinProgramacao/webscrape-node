var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var images = [];

app.get('/scrape', function(req, res){
  // Let's scrape Anchorman 2
  url = 'http://www.imdb.com/title/tt1229340/';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};

      $('.title_wrapper').filter(function(){
        var data = $(this);
        title = data.children().first().text().trim();
        release = data.children().last().children().last().text().trim();

        json.title = title;
        json.release = release;
      })

      $('.ratingValue').filter(function(){
        var data = $(this);
        rating = data.text().trim();

        json.rating = rating;
      })

      $('img', '.poster').filter(function(){
        var data = $(this);
        img = data.attr('src');

        images.push(img);

        json.img = images;
      })


      images.map((image) => request(image).pipe(fs.createWriteStream('filme.jpg')))

      //for(var i = 0; i < images.length; i++){
        //request(images[i]).pipe(fs.createWriteStream('filme'+ i + '.jpg'));
      //}
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), (err) => {
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!');
  })
})
app.get('/image', function(req, res){

  url = 'https://picjumbo.com/?s=summer';

  request(url, function(err, response, html){
    if(!err){
      var $ = cheerio.load(html);

      $('img', '.content').filter(function(){
          var data = $(this);
          img = data.attr('src');

          images.push(img);
      });
      let i = 0;

      if( images.map((image) => request(image).pipe(fs.createWriteStream('landscape'+ i++ +'.jpg'))) ) {
        console.log('its ok');
      } else {
        console.log('Something went wrong');
      }
      //for(var i = 0; i < images.length; i++){
        //request(images[i]).pipe(fs.createWriteStream('image/landscape'+i+'.jpg'));
      //}
    }

    res.send('check dir image');
    
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
