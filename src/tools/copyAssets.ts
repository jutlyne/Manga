import * as shell from 'shelljs';

//Copy all the view Templates
shell.mkdir('-p', 'build/resources/views');
shell.cp('-R','src/resources/views/*', 'build/resources/views');

shell.mkdir('-p', 'build/public/images');
shell.cp('-R','src/resources/images/*', 'build/public/images');

//Copy all the public content
shell.cp('-R','src/public', 'build/');
