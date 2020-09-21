import arg from 'arg';
import Listr from 'listr';
import {launchGreenITAnalysis, openBrowser} from './checkEcoIndex';

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
       '--scenario': String,
        '-s': '--scenario',
   },
   {
     argv: rawArgs.slice(2),
   }
 );
 return {
     scenario: args['--scenario']
 };
}
async function promptForMissingOptions(options) {
  
}

export async function cli(args) {

  const tasks = new Listr([
      {
          title: 'Parsing Arguments',
          task: (ctx, task) => {
            ctx.options = parseArgumentsIntoOptions(args);
          }
      },
      {
          title: 'Creating scenario',
          skip: ctx => ctx.options.scenario != undefined && 'Scenario passed as cli argument',
          task: (ctx) => {
            ctx.scenario = promptForMissingOptions(ctx.options);
            throw new Error('not yet implemented');
          }
      },
      {
          title: 'Reading scenario',
          skip: ctx => ctx.scenario && 'Scenario created with cli',
          task: (ctx) => {
            ctx.scenario = require(ctx.options.scenario);
          }
      },
      {
          title: 'Opening Browser',
          task: async (ctx) => {
            ctx.browser = await openBrowser()
          }
      },
      {
          title: 'Analysing scenario',
          task: async (ctx, task) =>  await launchGreenITAnalysis(ctx.scenario, ctx.browser, task)
      },
      {
          title: 'Closing browser',
          task: async (ctx) =>  await ctx.browser.close()
      }
  ], {exitOnError:true});
  
  tasks.run({
      args
  }).then(ctx => {
      ctx.browser.close();
  }).catch(err => {
    console.error(err);
    if(err.context.browser) {
      err.context.browser.close();
    }
  });
}