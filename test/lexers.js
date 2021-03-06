
var lexers = require('../lib/lexers');
    
var TokenType = lexers.TokenType;

function getToken(text, value, type, test)
{
    var lexer = lexers.createLexer(text);
    assertToken(lexer, value, type, test);
    test.equal(lexer.nextToken(), null);
}

function assertToken(lexer, value, type, test)
{
    var token = lexer.nextToken();
    test.ok(token);
    test.equal(token.value, value);
    test.equal(token.type, type);
}
    
exports['Lexer defined'] = function (test) {
    test.ok(lexers.createLexer);
};

exports['Null token if null text'] = function (test) {
    var lexer = lexers.createLexer(null);

    test.equal(lexer.nextToken(), null);
};

exports['Null token if empty text'] = function (test) {
    var lexer = lexers.createLexer('');

    test.equal(lexer.nextToken(), null);
};

exports['Get simple name'] = function (test) {
    var lexer = lexers.createLexer('DIVISION');

    assertToken(lexer, 'DIVISION', TokenType.Name, test);

    test.equal(lexer.nextToken(), null);
};

exports['Get simple name with spaces'] = function (test) {
    var lexer = lexers.createLexer('  DIVISION  ');

    assertToken(lexer, 'DIVISION', TokenType.Name, test);

    test.equal(null, lexer.nextToken());
};

exports['Get simple name with digits'] = function (test) {
    var lexer = lexers.createLexer('ITEM01');

    assertToken(lexer, 'ITEM01', TokenType.Name, test);

    test.equal(lexer.nextToken(), null);
};

exports['Get two simple names'] = function (test) {
    var lexer = lexers.createLexer('IDENTIFICATION DIVISION');

    assertToken(lexer, 'IDENTIFICATION', TokenType.Name, test);
    assertToken(lexer, 'DIVISION', TokenType.Name, test);

    test.equal(lexer.nextToken(), null);
};

exports['Get name with minus sign'] = function (test) {
    var lexer = lexers.createLexer('WORKING-STORAGE');

    assertToken(lexer, 'WORKING-STORAGE', TokenType.Name, test);

    test.equal(null, lexer.nextToken());
};

exports['Get integer number'] = function (test) {
    var lexer = lexers.createLexer('123');

    assertToken(lexer, '123', TokenType.Integer, test);

    test.equal(null, lexer.nextToken());
};

exports['Get integer number with leading zeroes'] = function (test) {
    var lexer = lexers.createLexer('003');

    assertToken(lexer, '003', TokenType.Integer, test);

    test.equal(lexer.nextToken(), null);
};

exports['Get simple string'] = function (test) {
    getToken('"ADAM"', 'ADAM', TokenType.String, test);
};

exports['Get simple string with quote'] = function (test) {
    getToken('"AD\\\"AM"', 'AD\\\"AM', TokenType.String, test);
};

exports['Raise if unclosed string'] = function (test) {
    var lexer = lexers.createLexer('"ADAM');

    test.throws(
        function() {
            assertToken(lexer, 'ADAM', TokenType.String, test);
        },
        function(ex) {
            return ex == "unclosed string";
        });
};

exports['Raise if unexpected character'] = function (test) {
    var lexer = lexers.createLexer('!');

    test.throws(
        function() {
            assertToken(lexer, '!', TokenType.String, test);
        },
        function(ex) {
            return ex == "unexpected '!'";
        });
};

exports['Get point as Punctuation'] = function (test) {
    getToken('.', '.', TokenType.Punctuation, test);
};

exports['Get comma as Punctuation'] = function (test) {
    getToken(',', ',', TokenType.Punctuation, test);
};

exports['Get parenthesis as Punctuation'] = function (test) {
    getToken('(', '(', TokenType.Punctuation, test);
    getToken(')', ')', TokenType.Punctuation, test);
};

exports['Skip line comment'] = function (test) {
    getToken('* This is a line comment \r\nDIVISION', 'DIVISION', TokenType.Name, test);
};

exports['Skip two line comments'] = function (test) {
    getToken('* This is a line comment \r\n* This is another line comment \r\nDIVISION', 'DIVISION', TokenType.Name, test);
};

exports['Get Phrase'] = function (test) {
    var lexer = lexers.createLexer("HELLO.");

    test.equal(lexer.nextPhrase(), "HELLO");
};

exports['Get Phrase with initial spaces and end of line'] = function (test) {
    var lexer = lexers.createLexer("   HELLO.\r\n");

    test.equal(lexer.nextPhrase(), "HELLO");
};

exports['Get Phrase with inner points'] = function (test) {
    var lexer = lexers.createLexer("A.J.LOPEZ.\r\n");

    test.equal(lexer.nextPhrase(), "A.J.LOPEZ");
};

exports['Get comparison operators'] = function (test) {
    getToken('<','<',TokenType.Operator, test);
    getToken('>','>',TokenType.Operator, test);
    getToken('=','=',TokenType.Operator, test);
    getToken('>=','>=',TokenType.Operator, test);
    getToken('<=','<=',TokenType.Operator, test);
};

