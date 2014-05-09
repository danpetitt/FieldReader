/*
This object was created to parse file data saved from an Excel spreadsheet in CSV or TSV format.

Just create a new FieldReader object passing a field and line delimiter character, then throw characters at it.

Once all the data is parsed, call 'end()' and then you can get at the field, row information.

Methods:
gotChar( character );  // each character from the file is passed in using this method
end();                 // when all data is passed in, call 'end'

rowCount();            // get total number of rows retrieved
fieldCount( row );     // get total number of fields for a given row (zero indexed)
field( row, field );   // get field data for given row and field index (zero indexed)

Example:
var data = "test1\t\"test 2\nsecond row in cell\"\t\"test 3, oh oh \"\"aha\"\"\"\t8328\t\"\"\"test4 multiples\"\"\"\ntest1b\t\"test 2b\nsecond row in cell\"\t\"test 3b, oh oh \"\"aha\"\"\"\t99\t\"\"\"test4b multiples\"\"\"\ntest1c\t\"test 2c\nsecond row in cell\"\t\"test 3c, oh oh \"\"aha\"\"\"\t14\t\"test4c multiples\"";

var parser = new FieldReader( "\t", "\n" );
for( var n = 0; n < data.length; n++ )
{
  parser.gotChar( data.charAt( n ) );
}
parser.end();


// Setup test using: https://gist.github.com/coderangerdan/10770050
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
*/

var FieldReader = function( fieldDelimiterCharacter, lineDelimiterCharacter )
{
  var _fieldDelimiter = "\t";
  var _lineDelimiter = "\n";
  if ( typeof fieldDelimiterCharacter !== 'undefined' )
  {
    _fieldDelimiter = fieldDelimiterCharacter;
  }
  if ( typeof lineDelimiterCharacter !== 'undefined' )
  {
    _lineDelimiter = lineDelimiterCharacter;
  }


  var _rows = [];
  var _fields = [];

  var _currentField = "";
  var _inQuotes = false;
  var _lastChar = "";
  var _skipNextChar = false;


  // public api
  return {
    // set a new field delimiter
    fieldDelimiter : function( delimiterCharacter ) {
      _fieldDelimiter = delimiterCharacter;
    },

    // set a new line delimiter
    lineDelimiter : function( delimiterCharacter ) {
      _lineDelimiter = delimiterCharacter;
    },
    
    // return number of rows parsed
    rowCount : function() { return _rows.length; },
    
    // rows and fields are zero indexed
    field : function( row, field ) {
      return _rows[ row ][ field ];
    },
    
    // rows are zero indexed
    fieldCount : function( row ) {
      return _rows[ row ].length;
    },

    // pump your data into this function, char at a time
    gotChar : function( char ) {
      if( _skipNextChar )
      {
        _skipNextChar = false;
        _lastChar = char;
        return;
      }

      switch( _lastChar )
      {
        case "\"":
          if( char == "\"" )
          {
            _currentField += _lastChar;
            _skipNextChar = true;
          }
          else
          {
            _inQuotes = !_inQuotes;
          }
          break;
 
        case _fieldDelimiter:
          if( !_inQuotes )
          {
            _fields.push( _currentField );
            _currentField = "";
          }
          else
          {
            _currentField += _lastChar;
          }
          break;
                                               
        case _lineDelimiter:
          if( !_inQuotes )
          {
            _fields.push( _currentField );
            _rows.push( _fields );

            _fields = [];
            _currentField = "";
          }
          else
          {
            _currentField += _lastChar;
          }
          break;
          
        default:
          _currentField += _lastChar;
      }
   
      _lastChar = char;
    },
    
    // call end to finish parsing
    end : function() {
      if( _lastChar.length > 0 )
      {
        if( _lastChar != _lineDelimiter && _lastChar != "\"" )
          _currentField += _lastChar;

        // didnt have an empty line at end so add our last field
        _fields.push( _currentField );
        _rows.push( _fields );
      }
    }
  };
};
