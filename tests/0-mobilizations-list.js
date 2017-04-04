/* global __utils__, require:true, casper:true */


casper.options.exitOnError = false
// casper.options.logLevel = 'debug'
// casper.options.verbose = true
casper.options.pageSettings.loadImages = true        // The WebPage instance used by Casper will
casper.options.pageSettings.loadPlugins = true         // use these settings

casper.options.viewportSize = { width: 1024, height: 768 }
var errors = []

casper.on('page.error', function (msg, trace) {
  this.echo('Error:    ' + msg, 'ERROR')
  this.echo('file:     ' + trace[0].file, 'WARNING')
  this.echo('line:     ' + trace[0].line, 'WARNING')
  this.echo('function: ' + trace[0]['function'], 'WARNING')
  errors.push(msg)
})

casper.on('resource.error', function (resourceError) {
  this.echo('ResourceError: ' + JSON.stringify(resourceError, undefined, 4))
})

casper.on('remote.message', function (msg) {
  this.echo('Console: ' + msg)
})

casper.on('page.initialized', function (page) {
  // CasperJS doesn't provide `onResourceTimeout`, so it must be set through
  // the PhantomJS means. This is only possible when the page is initialized
  page.onResourceTimeout = function (request) {
    console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request))
  }
})

casper.test.begin('Login', 5, function suite (test) {
  casper.start('http://reboo-staging.org')
  // casper.start('http://bonde.devel:3001')
  casper.then(function () {
    this.capture('screenshots/0-login.png')
    this.waitForResource(/.*\.(js|png)$/, function () {
      this.echo('assets has been loaded.')
    })

    var signinForm = 'form'

    this.test.assertExist(signinForm, 'Signin form exists')
    this.test.assertExist(signinForm + ' [id="emailId"]', 'Email field exists')
    this.test.assertExist(signinForm + ' [id="passwordId"]', 'Password field exists')

    this.sendKeys(signinForm + ' [id="emailId"]', 'foo@bar.com')
    this.sendKeys(signinForm + ' [id="passwordId"]', 'foobar')

    this.test.assertFieldCSS(signinForm + ' [id="emailId"]', 'foo@bar.com') // undefined
    this.test.assertFieldCSS(signinForm + ' [id="passwordId"]', 'foobar') // undefined
    this.capture('screenshots/1-login.png')

    casper.wait(2000, function () {
      this.click(signinForm + ' button')
      casper.wait(4000, function () {
        this.capture('screenshots/2-login.png')
        this.test.done()
      })
    })
  })

  casper.then(function () {
    console.log('clicked ok, new location is ' + this.getCurrentUrl())

    this.test.assertUrlMatch(/community/, 'listing communities')
    this.test.assertExists('.rounded.bg-white .ListItem', 'at least one community is available')
    this.capture('screenshots/login-2.png')
    this.test.done()
  })
})

casper.run(function () {
  this.test.renderResults(true)
  if (errors.length > 0) {
    this.echo(errors.length + ' Javascript errors found', 'WARNING')
  } else {
    this.echo(errors.length + ' Javascript errors found', 'INFO')
  }
  casper.exit()
})
