import arg from 'arg';
import inquirer from 'inquirer';
import launchGreenITAnalysis from './checkEcoIndex';

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
       '--scenario': String,
     '--git': Boolean,
     '--yes': Boolean,
     '--install': Boolean,
        '-s': '--scenario',
     '-g': '--git',
     '-y': '--yes',
     '-i': '--install',
   },
   {
     argv: rawArgs.slice(2),
   }
 );
 return {
     scenario: args['--scenario'],
   skipPrompts: args['--yes'] || false,
   git: args['--git'] || false,
   url: args._[0],
   runInstall: args['--install'] || false,
 };
}
async function promptForMissingOptions(options) {
    const defaultTemplate = 'JavaScript';
    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
   
    const questions = [];
    if (!options.template) {
      questions.push({
        type: 'list',
        name: 'url',
        message: 'Please choose which project template to use',
        choices: ['JavaScript', 'TypeScript'],
        default: defaultTemplate,
      });
    }
   
    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false,
      });
    }
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      template: options.template || answers.template,
      git: options.git || answers.git,
    };
   }

export async function cli(args) {
 let options = parseArgumentsIntoOptions(args);
 //options = await promptForMissingOptions(options);
 const scenario = require(options.scenario)
 launchGreenITAnalysis(scenario)
}