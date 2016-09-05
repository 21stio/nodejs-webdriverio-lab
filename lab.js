var webdriverio = require('webdriverio');

function createClient() {
    var options = {
        host: process.env.SELENIUM_HUB_HOST,
        port: process.env.SELENIUM_HUB_PORT,
        logLevel: 'verbose',
        desiredCapabilities: {
            browserName: 'chrome'
        }
    };

    return webdriverio.remote(options);
}


function testRequestInterception() {
    return createClient()
        .init()
        .url('https://www.instagram.com/therock/')
        .getTitle().then(function (title) {
            console.log('Title is: ' + title);
        })
        .execute(function () {
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
}

function testheaders() {
    return createClient()
        .init()
        .url('https://httpbin.org/headers')
        .getSource().then(function (source) {
            console.log(source);
        })
}

function testCookiesBehaviour() {
    return createClient()
        .init()
        .url('https://httpbin.org/cookies/set?testcookie=testvalue')
        .getText('body').then(function (text) {
            console.log({client: "1", path: "cookies/set?testcookie=testvalue", text: text});
        })
        .url('https://httpbin.org/cookies')
        .getText('body').then(function (text) {
            console.log({client: "1", path: "/cookies", text: text});
            return createClient()
                .init()
                .url('https://httpbin.org/cookies')
                .getText('body').then(function (text) {
                    console.log({client: "2", path: "/cookies", text: text});
                })
        })
}

testCookiesBehaviour();