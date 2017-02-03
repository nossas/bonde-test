/* global __utils__, require:true, casper:true */

casper.test.begin('a twitter bootstrap dropdown can be opened', 2, function (test) {
  casper.start('http://getbootstrap.com/2.3.2/javascript.html#dropdowns', function () {
    test.assertExists('#navbar-example')
    this.click('#dropdowns .nav-pills .dropdown:last-of-type a.dropdown-toggle')
    this.waitUntilVisible('#dropdowns .nav-pills .open', function () {
      test.pass('Dropdown is open')
    })
  }).run(function () {
    test.done()
  })
})

casper.test.begin('Google search retrieves 10 or more results', 5, function suite (test) {
  casper.start('http://www.google.fr/', function () {
    test.assertTitle('Google', 'google homepage title is the one expected')
    test.assertExists('form[action="/search"]', 'main form is found')
    this.fill('form[action="/search"]', {
      q: 'casperjs'
    }, true)
  })

  casper.then(function () {
    test.assertTitle('casperjs - Recherche Google', 'google title is ok')
    test.assertUrlMatch(/q=casperjs/, 'search term has been submitted')
    test.assertEval(function () {
      return __utils__.findAll('h3.r').length >= 10
    }, 'google search for "casperjs" retrieves 10 or more results')
  })

  casper.run(function () {
    test.done()
  })
})
