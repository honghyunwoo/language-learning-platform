/**
 * fix-sw-async.js
 *
 * Fix _async_to_generator is not defined error in sw.js
 *
 * @ducanh2912/next-pwa v10.2.9 has a bug where it uses _async_to_generator
 * in handlerDidError callbacks but doesn't include the Babel helper function.
 *
 * This script injects the helper function into sw.js after build.
 */

const fs = require('fs');
const path = require('path');

// Babel & TypeScript helpers (minified)
// Includes: _async_to_generator, asyncGeneratorStep, _ts_generator
const ASYNC_HELPER = `function _async_to_generator(e){return function(){var t=this,r=arguments;return new Promise(function(n,o){var i=e.apply(t,r);function c(e){return asyncGeneratorStep(i,n,o,c,u,"next",e)}function u(e){return asyncGeneratorStep(i,n,o,c,u,"throw",e)}c(void 0)})}}function asyncGeneratorStep(e,t,r,n,o,i,c){try{var u=e[i](c),s=u.value}catch(e){return void r(e)}u.done?t(s):Promise.resolve(s).then(n,o)}function _ts_generator(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function c(o){return function(c){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,c])}}}`;

const SW_PATH = path.join(__dirname, '../public/sw.js');

try {
  // Read sw.js
  const swContent = fs.readFileSync(SW_PATH, 'utf8');

  // Check if _async_to_generator or _ts_generator is used but not defined
  if ((swContent.includes('_async_to_generator') || swContent.includes('_ts_generator')) &&
      !swContent.includes('function _async_to_generator')) {
    console.log('🔧 Fixing sw.js: Injecting TypeScript/Babel helpers...');

    // Inject helper at the beginning (after the first function wrapper)
    const fixed = swContent.replace(
      /^(.*?define\(\[.*?\],function\(e\)\{)/,
      `$1${ASYNC_HELPER};`
    );

    // Write fixed sw.js
    fs.writeFileSync(SW_PATH, fixed, 'utf8');

    console.log('✅ sw.js fixed successfully!');
    console.log(`   Added helpers: _async_to_generator, asyncGeneratorStep, _ts_generator (${ASYNC_HELPER.length} bytes)`);
  } else if (!swContent.includes('_async_to_generator')) {
    console.log('✅ sw.js does not need fixing (no _async_to_generator usage)');
  } else {
    console.log('✅ sw.js already has _async_to_generator defined');
  }
} catch (error) {
  console.error('❌ Error fixing sw.js:', error.message);
  process.exit(1);
}
