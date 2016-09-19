var webdriverio = require('webdriverio');

var proxy = "188.166.245.248:8080";

function createClient () {
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

function createProxyClient () {
    var options = {
        host: process.env.SELENIUM_HUB_HOST,
        port: process.env.SELENIUM_HUB_PORT,
        logLevel: 'verbose',
        desiredCapabilities: {
            browserName: 'chrome',
            proxy: {
                proxyType: 'MANUAL',
                httpProxy: proxy,
                sslProxy: proxy
            }
        }
    };

    return webdriverio.remote(options);
}

function testRequestInterception () {
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

function testheaders () {
    return createClient()
        .init()
        .url('https://httpbin.org/headers')
        .getSource().then(function (source) {
            console.log(source);
        })
}

function testCookiesBehaviour () {
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

function testMultiplePage () {
    return createClient()
        .init()
        .url("https://httpbin.org/get?abc=zui")
        .getText("body").then(function (text) {
            console.log(JSON.parse(text));
        })
        .url("https://httpbin.org/get?abc=xyz")
        .getText("body").then(function (text) {
            console.log(JSON.parse(text));
        });
}

function testPageLoop () {
    var browser = createClient().init();

    for (var parameter of ['xcv', 'lop']) {
        browser = browser.url("https://httpbin.org/get?abc=" + parameter)
            .getText("body").then(function (text) {
                console.log(JSON.parse(text));
            });
    }
}

function testProxy () {
    var browser = createProxyClient().init();

    browser.url("https://httpbin.org/ip")
        .getText("body").then(function (text) {
            console.log("proxy: ", proxy);
            console.log(JSON.parse(text));
        });
}

function testClassWithInitilizedBrowser () {
    class ClassWithInitilizedBrowser {

        constructor (browser) {
            this.browser = browser.init();
        }

        doSomething () {
            var self = this;

            for (var parameter of ['aaa', 'bbb']) {
                self.browser = self.browser.url("https://httpbin.org/get?abc=" + parameter)
                    .getText("body").then(function (text) {
                        console.log(JSON.parse(text));
                    })
            }
        }

    }
    
    let myClass = new ClassWithInitilizedBrowser(createClient());

    myClass.doSomething();
}


testProxy();