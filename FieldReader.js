/**
 * FieldReader - A simple JavaScript object to to parse file data saved from an Excel spreadsheet in CSV or TSV format
 * @author Dan Petitt <danp@coderanger.com>
 * Homepage: https://github.com/coderangerdan/FieldReader
 *
 * The MIT License (MIT)
 * Copyright (c) 2014 Dan Petitt
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
