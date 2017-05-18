# contributing 


## developing

clone this repository, then

    npm install


to run the tests, you will need to run an influx database. (i'm sorry!)
I have a database running on localhost, default creds, with 2078970 rows, which is kind of what the tests expect.
that database is, for me, called 'poloniex-histories.'
so, you can create a database by the same name, and add 2078970 random points to it...

if you have a better way to run these tests, please issue a PR!

once you have that setup, you can

    npm run watch

now you can edit js files in src/ and test/ - tests will automatically re-run

## todo

- annoying to run tests - requires special setup!
- TESTS ARE SLOW!

