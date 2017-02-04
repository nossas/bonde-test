/* global __utils__, require:true, casper:true */

casper.options.exitOnError = false
casper.options.logLevel = 'debug'
casper.options.verbose = true
casper.options.viewportSize = { width: 1024, height: 768 }
var errors = []

casper.on('page.error', function (msg, trace) {
  this.echo('Error:    ' + msg, 'ERROR')
  this.echo('file:     ' + trace[0].file, 'WARNING')
  this.echo('line:     ' + trace[0].line, 'WARNING')
  this.echo('function: ' + trace[0]['function'], 'WARNING')
  errors.push(msg)
})

casper.test.begin('Login', 1, function suite (test) {
  casper.start('http://app.reboo-staging.org')
  casper.then(function () {
    this.capture('screenshots/0-login.png')
    this.waitForResource(/.*\.(js|png)$/, function () {
      this.echo('foobar.png or foobaz.png has been loaded.')
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

    casper.wait(10000, function () {
      this.click(signinForm + ' button')
      casper.wait(5000, function () {
        this.capture('screenshots/2-login.png')
      })
    })
  })

  casper.then(function () {
    console.log('clicked ok, new location is ' + this.getCurrentUrl())

    test.assertUrlMatch(/community/, 'listing communities')
    test.assertEval(function () {
      return __utils__.findAll('.rounded.bg-white .ListItem').length >= 1 &&
        casper.capture('screenshots/login-2.png')
    }, 'at least one community is available')
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
})
