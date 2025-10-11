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

// Babel helper: _async_to_generator (minified)
const ASYNC_HELPER = `function _async_to_generator(e){return function(){var t=this,r=arguments;return new Promise(function(n,o){var i=e.apply(t,r);function c(e){return asyncGeneratorStep(i,n,o,c,u,"next",e)}function u(e){return asyncGeneratorStep(i,n,o,c,u,"throw",e)}c(void 0)})}}function asyncGeneratorStep(e,t,r,n,o,i,c){try{var u=e[i](c),s=u.value}catch(e){return void r(e)}u.done?t(s):Promise.resolve(s).then(n,o)}`;

const SW_PATH = path.join(__dirname, '../public/sw.js');

try {
  // Read sw.js
  const swContent = fs.readFileSync(SW_PATH, 'utf8');

  // Check if _async_to_generator is used but not defined
  if (swContent.includes('_async_to_generator') && !swContent.includes('function _async_to_generator')) {
    console.log('🔧 Fixing sw.js: Injecting _async_to_generator helper...');

    // Inject helper at the beginning (after the first function wrapper)
    const fixed = swContent.replace(
      /^(.*?define\(\[.*?\],function\(e\)\{)/,
      `$1${ASYNC_HELPER};`
    );

    // Write fixed sw.js
    fs.writeFileSync(SW_PATH, fixed, 'utf8');

    console.log('✅ sw.js fixed successfully!');
    console.log(`   Added _async_to_generator helper (${ASYNC_HELPER.length} bytes)`);
  } else if (!swContent.includes('_async_to_generator')) {
    console.log('✅ sw.js does not need fixing (no _async_to_generator usage)');
  } else {
    console.log('✅ sw.js already has _async_to_generator defined');
  }
} catch (error) {
  console.error('❌ Error fixing sw.js:', error.message);
  process.exit(1);
}
