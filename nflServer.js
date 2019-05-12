const express = require('express');
const path = require('path');
const fs = require('fs');
const d3 = require('d3-dsv');
const execSync = require('child_process').execSync;
const PORT = 8888;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req,res)=>res.render('pages/index'))
  .get('/getSchedule', (req,res)=> {
    var week = req.query.week;
    if (req.query.week === undefined) week = 16;
    var games = loadWeek(week);
    res.write(JSON.stringify(games)) 
        res.end();
  })
  .get('/findWinner', (req,res)=>{
      var home = req.query.home;
      var away = req.query.away;

      console.log(home+away);
      var result = execSync(`java -jar Web_Scraping.jar ${home} ${away}`);

      res.write(result.toString());
      res.end();
  })

  .listen(PORT, ()=>console.log("Listening!"));

  function loadWeek(week){
    var table = fs.readFileSync("./db/schedule.csv").toString();
    var rows = d3.csvParse(table);
    var thisWeek = rows.filter((row)=> row.Week == week);
    var formattedWeek = thisWeek.map((game)=> {return {Home : game.Home, Away : game.Away}});
          
    return formattedWeek;
  }

