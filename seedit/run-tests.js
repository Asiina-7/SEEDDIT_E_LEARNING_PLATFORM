const { execSync } = require('child_process');
const fs = require('fs');
try {
  const result = execSync('npm test -- --run', { encoding: 'utf8', shell: true });
  fs.writeFileSync('C:\\\\Users\\\\ELCOT\\\\Downloads\\\\seedit_edu\\\\seedit\\\\test-out.txt', String(result));
} catch (error) {
  let out = 'ERROR\\n';
  if (error && error.stdout) out += String(error.stdout);
  if (error && error.stderr) out += String(error.stderr);
  out += '\\nMSG: ' + String(error.message);
  fs.writeFileSync('C:\\\\Users\\\\ELCOT\\\\Downloads\\\\seedit_edu\\\\seedit\\\\test-out.txt', out);
}
