import fs from 'fs'
import readline from 'readline'

export const exists = (path: string): boolean => {
  try {
    fs.readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

export const question = (prompt: string): Promise<string> => new Promise((resolve) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(prompt, (token) => {
    resolve(token);
    rl.close();
  });
})

export const base64toUTF8 = function base64toUTF8(str: string, urlsafe: boolean) {
  if (urlsafe) {
    str = str.replace(/_/g,"/");
    str = str.replace(/-/g,"+");
  }
  return new Buffer(str, 'base64').toString('utf8');
};


export default {
  base64toUTF8,
  question,
  exists
}
