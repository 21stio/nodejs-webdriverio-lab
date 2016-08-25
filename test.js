var webdriverio = require('webdriverio');
var options = {
	host: 'hub',
	port: 4444,
	logLevel: 'verbose',
	desiredCapabilities: { 
		browserName: 'chrome' 
	} 
};
var client = webdriverio.remote(options);


client
    .init()
    .url('https://www.instagram.com/therock/')
    .getTitle().then(function(title) {
        console.log('Title is: ' + title);
    })
    .execute(() => {
    	(function (send) {
            XMLHttpRequest.prototype.send = function () {
                this.addEventListener('readystatechange', function () {
                    console.log(this)
                }, false)
                send.apply(this, arguments)
            }
        })(XMLHttpRequest.prototype.send)
    })
    .scroll(0, 500)
    .pause(500)
    .scroll(0, 1500)
    .pause(500)
    .execute(() => {
    	(function (send) {
            XMLHttpRequest.prototype.send = function () {
                this.addEventListener('readystatechange', function () {
                    console.log('Yooo')
                }, false)
                send.apply(this, arguments)
            }
        })(XMLHttpRequest.prototype.send)
    })
    .scroll(0, 2500)
    .pause(500)
    .scroll(0, 3500)
    .pause(500)
    .scroll(0, 4500)
    .pause(500)
    .execute(() => {
    	(function (send) {
            XMLHttpRequest.prototype.send = function () {
                this.addEventListener('readystatechange', function () {
                    console.log('Yooo')
                }, false)
                send.apply(this, arguments)
            }
        })(XMLHttpRequest.prototype.send)
    })
    .scroll(0, 5500)
    .pause(500)
    .scroll(0, 6500)
    .pause(500)
    .scroll(0, 7500)
    .pause(500)
    .end();