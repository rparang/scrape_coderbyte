// Scrape Coderbyte is a node app that scrapes your challenges and
// saves those that you've completed to your local machine. If you've
// spent time on challenges through the browser and realized
// it may be nice to have these saved for other purposes, this may be helpful.

// Keep it mind, since this scrapes the site by parsing the returned HTML and 
// doesn't use a dedicated Coderbyte API, the likeliness it breaks is high.
// ------------------------------------------------------------------------

var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');

// Since our challenges require a login, manually log into
// your Coderbyte account in your browser and capture the cookie information so we can use this with
// our requests. You can do this by using Chrome's Inspect tool. Navigate to Coderbyte and login.
// Under 'Network', select the request to an HTML page and then look at Request Headers. Copy 
// the string under 'Cookie' to the variable below.
var url = 'http://coderbyte.com/CodingArea/Challenges/',
    cookie = 'PHPSESSID=xxx; UserNameCookie=yyy; UserPasswordCookie=zzz',
    results = [];

request(
  {
    url : url,
    headers : {
      "Cookie": cookie
    }
  },
  getChallenges
);

// Get the list of challenges from Coderbyte and store each
// challenges data including title, url, description, and 
// whether it's been completed
function getChallenges(error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);

    // Traverse to find both divs for completed and not completed
    $('div.challenge_button_month_C').add('div.challenge_button_month_NC').find('p').each(function(i, element){

      var p = $(this);
      var title = p.text().replace(/(Not Completed)|(Completed)/, '').trim(); // Strip 'Not Completed' or 'Completed'
      var url = 'http://coderbyte.com/CodingArea/Results.php?ct='+encodeURIComponent(title)+'&lan=JavaScript';
      var description = p.parent().parent().next().text();
      var completed = (/^((?!Not).)*$/).test(p.text()); //Returns true if 'Not' is not in title

      // Object of parsed meta data
      var metadata = {
        title: title,
        url: url,
        description: description,
        completed: completed
      };

      // Store objects in array
      results.push(metadata);

    });

    getCode(results);
  }
}

// For each completed challenge, parse your submitted code
// and save the code as a local file.
function getCode(results) {
  for (var i=0; i<results.length; i++) {
    // Request each index item
    if (results[i].completed == true) {
      (function (result) {
        request(
          {
            url : result.url,
            headers : {
              "Cookie" : cookie
            }
          },
          function(error, response, body) {
            var file_title = result.title.replace(/[^a-z0-9]/gi, '_');
            var gooz = body.match(/<textarea id="code" name='code'>[\s\S]*<\/textarea>/g);

            try {
              var code = gooz[0].replace(/<textarea id="code" name='code'>/,'').replace(/<\/textarea>/,'').trim();
              fs.writeFile("./challenges/"+file_title+".js", code, function(err) {
                if(err) {
                  console.log(err);
                } else {
                  console.log(file_title + " was saved!");
                }
              }); 
            }
            catch(err) {
                console.log(err)
            }
          }
        );
      })(results[i]);
    };
  }
}
