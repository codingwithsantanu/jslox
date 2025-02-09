# Crafting Interpreters - Lox
Here is a _complete grammar for Lox_. This grammar can also be found in the `Appendix I` of `Crafting Interpreters`.

**`NOTE`**: The grammar is written using **EBNF** _( Extended Backus-Naur Form)_ for better readbility and extensibility.

## Syntax Grammar
The syntactic grammar is used to parse the linear sequence of tokens into the nested syntax tree structure. It starts with the first rule that matches an entire Lox program (or a single REPL entry).

``` ebnf
program        → declaration* EOF ;
```

This means the program consists of zero or more number of _declarations_ and ends with an _EOF (End of File)_.


### Declarations
A program is a series of declarations, which are the statements that bind new identifiers or any of the other statement types.

``` ebnf
declaration    → classDecl
               | funDecl
               | varDecl
               | statement ;

classDecl      → "class" IDENTIFIER ( "<" IDENTIFIER )?
                 "{" function* "}" ;
funDecl        → "fun" function ;
varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;
```

This means that _declaration_ is a statement among: classDecl meaning class declarations, funDecl meaning function declarations, varDecl meaning variable declarations, or any other statement.

Class declarations start with the keyword "class" followed by it's name. Then there is an optional place for inheritance which starts with the following keyword "<" followed by the superclass name. Then after an open brace there are functions _(it is different than funDecl)_ followed by a closing brace.

Function declarations start with the keyword "fun" followed by another utility rule named function. We will discuss about it later after discussing statements and expressions.

Variable declarations start with the keyword "var" followed by it's name, and optionally an initializer that could be found after another equals "=" symbol.


### Statements
The remaining statement rules produce side effects, but do not introduce
bindings.

``` ebnf
statement      → exprStmt
               | forStmt
               | ifStmt
               | printStmt
               | returnStmt
               | whileStmt
               | block ;

exprStmt       → expression ";" ;
forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
                           expression? ";"
                           expression? ")" statement ;
ifStmt         → "if" "(" expression ")" statement
                 ( "else" statement )? ;
printStmt      → "print" expression ";" ;
returnStmt     → "return" expression? ";" ;
whileStmt      → "while" "(" expression ")" statement ;
block          → "{" declaration* "}" ;
```

These rulles are similar to the previous rules that we've discussed so I'm not going to be explaining what they mean. You are smart enough to find it our yourself, aren't you?

**NOTE**: `block` is a statement rule but is also used as a non-terminal in a couple other rules like function bodies.


### Expressions
Expressions are like statements but they produces some value and doesn't end with a semicolon. If they end with a semicolon, they are expression statements. Lox has a number of unary and binary operators with
different levels of precedence. Some grammars for languages do not directly
encode the precedence relationships and specify that elsewhere. Here, we use a
separate rule for each precedence level to make it explicit.

``` ebnf
expression     → assignment ;

assignment     → ( call "." )? IDENTIFIER "=" assignment
               | logic_or ;

logic_or       → logic_and ( "or" logic_and )* ;
logic_and      → equality ( "and" equality )* ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" ) unary )* ;

unary          → ( "!" | "-" ) unary | call ;
call           → primary ( "(" arguments? ")" | "." IDENTIFIER )* ;
primary        → "true" | "false" | "nil" | "this"
               | NUMBER | STRING | IDENTIFIER | "(" expression ")"
               | "super" "." IDENTIFIER ;
```

Now you may start to get the hang of these rules. If you understand them, Parsing wouldn't be any issue for you.


### Utility Rules
In order to keep the above rules a little cleaner, some of the grammar is
split out into a few reused helper rules.

``` ebnf
function       → IDENTIFIER "(" parameters? ")" block ;
parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
arguments      → expression ( "," expression )* ;
```

---

## Lexical Grammar
Similar to syntax grammar, there is a lexical grammar that is used by the scanner, also known as, lexer to group the indivisual characters of the source code into tokens.

Where the syntax is [context free](https://en.wikipedia.org/wiki/Context-free_grammar), the lexical grammar is [regular](https://en.wikipedia.org/wiki/Regular_grammar). As you will see, there are no recursive rules in the lexical grammar.

``` ebnf
NUMBER         → DIGIT+ ( "." DIGIT+ )? ;
STRING         → "\"" <any char except "\"">* "\"" ;
IDENTIFIER     → ALPHA ( ALPHA | DIGIT )* ;
ALPHA          → "a" ... "z" | "A" ... "Z" | "_" ;
DIGIT          → "0" ... "9" ;
```

**Thanks for reading this documentation about Lox grammar. Hope you have a good day!**.