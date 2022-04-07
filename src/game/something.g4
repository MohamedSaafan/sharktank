grammar whileswitch;

start: (WS? assignment WS? | WS? (assign_after|assign_before) WS? ';')*(WS? for_loop WS? | WS? if_stat WS? | WS? switch WS? |WS? while_stat WS? | WS? break WS? | WS? continue WS? )?;
//for loop
for_loop: 'for' WS? '(' WS? (assignment WS?)? ';' WS? (condition|'true')? WS? ';' WS? ((assign_after | assign_before) WS?)? ')' WS? '{' WS? (start WS?)?'}' (WS? start WS?)? ;
//while loop
while_stat: 'while' WS? '(' WS? condition (WS? ('&&'|'||') WS? condition)*? WS? ')' WS? '{' WS? (start WS?)?'}' (WS? start WS?)?;
//if statment
if_stat: 'if' WS? '(' WS? condition (WS? ('&&'|'||') WS? condition)* WS? ')' WS?
'{' WS? (start WS?)?'}' ( WS? 'else' WS? 'if' WS? '(' (WS? ('&&'|'||') WS? condition)* WS? ')' WS?
'{' WS? (start WS?)? '}' WS?)* ('else'WS? '{' WS? (start WS?)?'}')? (WS? start WS?)?;
//switch
switch: 'switch' WS? '(' WS? ID WS? (Oprator WS? (INT | FLOAT | ID))? ')' WS? '{' WS? case WS? default? WS? '}' WS? start;
case: 'case' WS? (INT | STRING) WS? ':' WS? start WS? break WS? (case|default);
default: 'default' WS? ':' WS? start;

continue: 'continue' WS? ';';
break: 'break' WS? ';';

assignment: Type? WS? ID WS? '=' WS? ((ID Oprator)? (INT | FLOAT | ID)) double_assignment? WS? ';'? WS?;
double_assignment: WS? (','|';') WS? assignment;
condition: ID WS? double_condition? WS? ('<=' | '>=' | '<' | '>' | '==' | '!=') WS? (INT | FLOAT | ID);
double_condition: Oprator ID;
assign_after: ID ('++'|'--') double_assign?;
assign_before: ('++'|'--') ID double_assign?;
double_assign: WS?',' WS? (assign_after|assign_before);

Oprator: WS? ('+'|'-'|'/'|'*'|'%') WS?;
Type: 'int'| 'double' | 'long';
ID: ('A'..'Z'|'a'..'z')('_'|('a'..'z')|('A'..'Z')|('0'..'9'))*;
INT: ('0'..'9')*;
FLOAT: ('0'..'9')+ ('.')('0'..'9')* | ('.')('0'..'9')+;
STRING: ('"') ('\r'||'\n')* ('"');
WS: (' '| '\t' |'\n'|'\r')+{skip();};