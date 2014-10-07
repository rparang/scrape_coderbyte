# Overview
Scrape Coderbyte is a node app that scrapes your challenges from Coderbyte and saves those that you've completed to your local machine.

If you've spent time on challenges through the browser and realized it may be nice to have these saved for other purposes, this may be helpful.

Keep it mind, since this scrapes the site by parsing the returned HTML and doesn't use a dedicated Coderbyte API, it may not be stable.

# Usage

* Clone repository to your local machine
* `cd` into `scrape_coderbyte`
* Run `npm install` in the parent directory
* Manually log into `http://coderbyte.com/` to obtain cookie information needed by Node's `request` module and save as cookie variable. See note below
* Run `node scrape.js`

> Note: Since the challenges require a login, manually log into your Coderbyte account in your browser and capture the cookie information so we can use this with our requests. You can do this by using Chrome's Inspect tool. Navigate to Coderbyte and login. Under 'Network', select the request to an HTML page and then look at Request Headers. Copy the string under 'Cookie' to the variable in `scrape.js`.