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

export default {
  question,
  exists
}
