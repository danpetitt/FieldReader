FieldReader
===========

This simple JavaScript object was created to parse the awkward file data saved from an Excel spreadsheet saved in CSV or TSV format, into rows and fields.

### Usage
Just create a new `FieldReader` object passing a field and line delimiter character, then throw characters at it.

Once all the data is parsed, call `end()` and then you can get at the field, row information.

#### Methods
* `gotChar( character );`: each character from the file is passed in using this method
* `end();`: when all data is passed in, call 'end'
* `rowCount();`: get total number of rows retrieved
* `fieldCount( row );`: get total number of fields for a given row (zero indexed)
* `field( row, field );`: get field data for given row and field index (zero indexed)

#### Example
``` js
var data = "test1\t\"test 2\nsecond row in cell\"\t\"test 3, oh oh \"\"aha\"\"\"\t8328\t\"\"\"test4 multiples\"\"\"\ntest1b\t\"test 2b\nsecond row in cell\"\t\"test 3b, oh oh \"\"aha\"\"\"\t99\t\"\"\"test4b multiples\"\"\"\ntest1c\t\"test 2c\nsecond row in cell\"\t\"test 3c, oh oh \"\"aha\"\"\"\t14\t\"test4c multiples\"";

var parser = new FieldReader( "\t", "\n" );
for( var n = 0; n < data.length; n++ )
{
  parser.gotChar( data.charAt( n ) );
}
parser.end();

// Setup test using: https://github.com/coderangerdan/SimpleTest
var tester = new SimpleTest();
tester.equal( parser.rowCount(), 3 );
tester.equal( parser.field( 0, 0 ), "test1" );
tester.equal( parser.field( 0, 1 ), "test 2\nsecond row in cell" );
tester.equal( parser.field( 0, 2 ), "test 3, oh oh \"aha\"" );
tester.equal( parser.field( 0, 3 ), "8328" );
tester.equal( parser.field( 0, 4 ), "\"test4 multiples\"" );

tester.equal( parser.field( 1, 0 ), "test1b" );
tester.equal( parser.field( 1, 1 ), "test 2b\nsecond row in cell" );
tester.equal( parser.field( 1, 2 ), "test 3b, oh oh \"aha\"" );
tester.equal( parser.field( 1, 3 ), 99 );
tester.equal( parser.field( 1, 4 ), "\"test4b multiples\"" );

tester.equal( parser.field( 2, 0 ), "test1c" );
tester.equal( parser.field( 2, 1 ), "test 2c\nsecond row in cell" );
tester.equal( parser.field( 2, 2 ), "test 3c, oh oh \"aha\"" );
tester.equal( parser.field( 2, 3 ), 14 );
tester.equal( parser.field( 2, 4 ), "test4c multiples" );

tester.notEqual( parser.field( 2, 3 ), "test4c multipless" );
tester.finish();
```
