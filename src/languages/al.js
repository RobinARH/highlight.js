/*
Language: AL
Author: Robin Reynolds-Haertle
Contributor: 
Category: enterprise
*/

function(hljs) {
  var KEYWORDS = {
    keyword:
      // Normal keywords.
      'ARRAY|ASSERTERROR|BEGIN|BREAK|CASE|DO|DOWNTO|ELSE|END|EVENT|EXIT|FOR|FOREACH|FUNCTION|IF|IMPLEMENTS|IN|INDATASET|INTERFACE|INTERNAL|LOCAL|OF|PROCEDURE|PROGRAM|PROTECTED|REPEAT|RUNONCLIENT|SECURITYFILTERING|SUPPRESSDISPOSE|TEMPORARY|THEN|TO|TRIGGER|UNTIL|VAR|WHILE|WITH|WITHEVENTS' +
      'AND|DIV|MOD|NOT|OR|XOR' +
      'AVERAGE|CONST|COUNT|EXIST|FIELD|FILTER|LOOKUP|MAX|MIN|ORDER|SORTING|SUM|TABLEDATA|UPPERLIMIT|WHERE|ASCENDING|DESCENDING' + 
      'CODEUNIT|PAGE|PAGEEXTENSION|PAGECUSTOMIZATION|DOTNET|ENUM|ENUMEXTENSION|VALUE|QUERY|REPORT|TABLE|TABLEEXTENSION|XMLPORT|PROFILE|CONTROLADDIN' +
      'Action|Array|Automation|BigInteger|BigText|Blob|Boolean|Byte|Char|ClientType|Code|Codeunit|CompletionTriggerErrorLevel|ConnectionType|Database|DataClassification|DataScope|Date|DateFormula|DateTime|Decimal|DefaultLayout|Dialog|Dictionary|DotNet|DotNetAssembly|DotNetTypeDeclaration|Duration|Enum|ErrorInfo|ErrorType|ExecutionContext|ExecutionMode|FieldClass|FieldRef|FieldType|File|FilterPageBuilder|Guid|InStream|Integer|Joker|KeyRef|List|ModuleDependencyInfo|ModuleInfo|None|Notification|NotificationScope|ObjectType|Option|OutStream|Page|PageResult|Query|Record|RecordId|RecordRef|Report|ReportFormat|SecurityFilter|SecurityFiltering|Table|TableConnectionType|TableFilter|TestAction|TestField|TestFilterField|TestPage|TestPermissions|TestRequestPage|Text|TextBuilder|TextConst|TextEncoding|Time|TransactionModel|TransactionType|Variant|Verbosity|Version|XmlPort|HttpContent|HttpHeaders|HttpClient|HttpRequestMessage|HttpResponseMessage|JsonToken|JsonValue|JsonArray|JsonObject|View|Views|XmlAttribute|XmlAttributeCollection|XmlComment|XmlCData|XmlDeclaration|XmlDocument|XmlDocumentType|XmlElement|XmlNamespaceManager|XmlNameTable|XmlNode|XmlNodeList|XmlProcessingInstruction|XmlReadOptions|XmlText|XmlWriteOptions|WebServiceActionContext|WebServiceActionResultCode|SessionSettings' +
      'ADDFIRST|ADDLAST|ADDAFTER|ADDBEFORE|ACTION|ACTIONS|AREA|ASSEMBLY|CHARTPART|CUEGROUP|CUSTOMIZES|COLUMN|DATAITEM|DATASET|ELEMENTS|EXTENDS|FIELD|FIELDGROUP|FIELDATTRIBUTE|FIELDELEMENT|FIELDGROUPS|FIELDS|FILTER|FIXED|GRID|GROUP|MOVEAFTER|MOVEBEFORE|KEY|KEYS|LABEL|LABELS|LAYOUT|MODIFY|MOVEFIRST|MOVELAST|MOVEBEFORE|MOVEAFTER|PART|REPEATER|USERCONTROL|REQUESTPAGE|SCHEMA|SEPARATOR|SYSTEMPART|TABLEELEMENT|TEXTATTRIBUTE|TEXTELEMENT|TYPE',
  };
  var NUMBERS = {
    className: 'number',
    variants: [
      { begin: '\\b(0b[01\']+)' },
      { begin: '(-?)\\b([\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)(u|U|l|L|ul|UL|f|F|b|B)' },
      { begin: '(-?)(\\b0[xX][a-fA-F0-9\']+|(\\b[\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)([eE][-+]?[\\d\']+)?)' }
    ],
    relevance: 0
  };
  var VERBATIM_STRING = {
    className: 'string',
    begin: '@"', end: '"',
    contains: [{begin: '""'}]
  };
  var VERBATIM_STRING_NO_LF = hljs.inherit(VERBATIM_STRING, {illegal: /\n/});
  var SUBST = {
    className: 'subst',
    begin: '{', end: '}',
    keywords: KEYWORDS
  };
  var SUBST_NO_LF = hljs.inherit(SUBST, {illegal: /\n/});
  var INTERPOLATED_STRING = {
    className: 'string',
    begin: /\$"/, end: '"',
    illegal: /\n/,
    contains: [{begin: '{{'}, {begin: '}}'}, hljs.BACKSLASH_ESCAPE, SUBST_NO_LF]
  };
  var INTERPOLATED_VERBATIM_STRING = {
    className: 'string',
    begin: /\$@"/, end: '"',
    contains: [{begin: '{{'}, {begin: '}}'}, {begin: '""'}, SUBST]
  };
  var INTERPOLATED_VERBATIM_STRING_NO_LF = hljs.inherit(INTERPOLATED_VERBATIM_STRING, {
    illegal: /\n/,
    contains: [{begin: '{{'}, {begin: '}}'}, {begin: '""'}, SUBST_NO_LF]
  });
  SUBST.contains = [
    INTERPOLATED_VERBATIM_STRING,
    INTERPOLATED_STRING,
    VERBATIM_STRING,
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    NUMBERS,
    hljs.C_BLOCK_COMMENT_MODE
  ];
  SUBST_NO_LF.contains = [
    INTERPOLATED_VERBATIM_STRING_NO_LF,
    INTERPOLATED_STRING,
    VERBATIM_STRING_NO_LF,
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    NUMBERS,
    hljs.inherit(hljs.C_BLOCK_COMMENT_MODE, {illegal: /\n/})
  ];
  var STRING = {
    variants: [
      INTERPOLATED_VERBATIM_STRING,
      INTERPOLATED_STRING,
      VERBATIM_STRING,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ]
  };

  var TYPE_IDENT_RE = hljs.IDENT_RE + '(<' + hljs.IDENT_RE + '(\\s*,\\s*' + hljs.IDENT_RE + ')*>)?(\\[\\])?';

  return {
    aliases: ['xpp', 'X++'],
    keywords: KEYWORDS,
    illegal: /::/,
    contains: [
      hljs.COMMENT(
        '///',
        '$',
        {
          returnBegin: true,
          contains: [
            {
              className: 'doctag',
              variants: [
                {
                  begin: '///', relevance: 0
                },
                {
                  begin: '<!--|-->'
                },
                {
                  begin: '</?', end: '>'
                }
              ]
            }
          ]
        }
      ),
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'meta',
        begin: '#', end: '$',
        keywords: {
          'meta-keyword': 'if else elif endif define undef warning error line region endregion pragma checksum'
        }
      },
      STRING,
      NUMBERS,
      {
        beginKeywords: 'class interface', end: /[{;=]/,
        illegal: /[^\s:,]/,
        contains: [
          hljs.TITLE_MODE,
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      },
      {
        beginKeywords: 'namespace', end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: '[a-zA-Z](\\.?\\w)*'}),
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      },
      {
        // [Attributes("")]
        className: 'meta',
        begin: '^\\s*\\[', excludeBegin: true, end: '\\]', excludeEnd: true,
        contains: [
          INTERPOLATED_VERBATIM_STRING_NO_LF,
          INTERPOLATED_STRING,
          VERBATIM_STRING_NO_LF,
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.C_NUMBER_MODE
        ]
      },
      {
        // Expression keywords prevent 'keyword Name(...)' from being
        // recognized as a function definition
        beginKeywords: 'new return throw await else',
        relevance: 0
      },
      {
        className: 'function',
        begin: '(' + TYPE_IDENT_RE + '\\s+)+' + hljs.IDENT_RE + '\\s*\\(', returnBegin: true,
        end: /\s*[{;=]/, excludeEnd: true,
        keywords: KEYWORDS,
        contains: [
          {
            begin: hljs.IDENT_RE + '\\s*\\(', returnBegin: true,
            contains: [hljs.TITLE_MODE],
            relevance: 0
          },
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS,
            relevance: 0,
            contains: [
              STRING,
              NUMBERS,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      }
    ]
  };
}
