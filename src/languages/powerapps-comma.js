/*
Language: PowerApps-comma (comma decimal separator)
Author: Greg Lindhorst <gregli-msft@users.noreply.github.com>
Description: PowerApps formulae

Like Excel, PowerApps localizes the language for numbers: users in France
write "1,234" while users in Australia write "1.234".  This has a trickle
down effect on the character used to separate items in function argument
lists and record definitions, and the chaining operator separating function
calls.

    Dot decimal separator:
        Numbers: 1.234
        Lists: Collect( a, b, { value: 1.234, result: 4.567 } )
        Chaining: Set( x, 1.234 ); Notify( "Result is" & x )

    Comma decimal separator:
        Numbers: 1,234
        Lists: Collect( a; b; { value: 1,234; result: 4,567 } )
        Chaining: Set( x; 1,234 );; Notify( "Result is" & x )

Unfortunately, one coloring definition can't cover both of these cases.
For example, "Max(1,2)" is valid with both dot separator (result 2)
and comma separator (result 1,2), with the coloring of the comma between
the 1 and 2 being important for reader understanding.
*/

function(hljs) {
    return {
        aliases: ['powerapps-comma'],
        keywords: {
            keyword:
                'Acceleration|10 App Compass|10 Connection Location|10 ThisItem|10 Parent',
             literal:
                'true false'
        },
        contains: [
            {
                // identifiers containing special characters, enclosed in '...'
                begin: '\'', end: '\'',
                contains: [ {
                    begin: '\'\''
                } ]
            },
            {
                className: 'string',
                begin: '"', end: '"',
                contains: [ {
                    begin: '""'
                } ]
            },
            {
				// comma decimal separator
                className: 'number',
                begin: '(\\b\\d+([\\,]\\d*)?|\\b[\\,]\\d+)([eE][-+]?\\d+)?\\%?',
                relevance: 0
            },
            {
                // function names If() and method names Flow.Run()
                begin: '\\w+\\s*\\(',
                returnBegin: true,
                contains: [
                    {
                        className: 'built_in',
                        begin: '\\w+',
                    }
                ]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
        ]
    };
}
