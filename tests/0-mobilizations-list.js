/* global __utils__, require:true, casper:true */

casper.options.exitOnError = false
casper.options.logLevel = 'debug'
casper.options.verbose = true

casper.test.begin('Login', 1, function suite (test) {
  casper.start('http://app.reboo-staging.org')
  casper.then(function () {
    this.capture('screenshots/login.png')
    this.waitForResource(/.*\.(js|png)$/, function () {
      this.echo('foobar.png or foobaz.png has been loaded.')
    })

    var signinForm = 'form'

    this.test.assertExist(signinForm, 'Signin form exists')
    this.test.assertExist('[id="emailId"]', 'Email field exists')
    this.test.assertExist('[id="passwordId"]', 'Password field exists')

    this.sendKeys(signinForm + ' [id="emailId"]', 'foo@bar.com')
    this.sendKeys(signinForm + ' [id="passwordId"]', 'foobar')

    this.test.assertFieldCSS('[id="emailId"]', 'foo@bar.com') // undefined
    this.test.assertFieldCSS('[id="passwordId"]', 'foobar') // undefined

    this.click(signinForm + ' button')

    this.capture('screenshots/login-1.png')
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
  })
})
