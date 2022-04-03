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

export const base64toUTF8 = (str: string, urlsafe: boolean): string => {
  if (urlsafe) {
    str = str.replace(/_/g,"/");
    str = str.replace(/-/g,"+");
  }
  return Buffer.from(str, 'base64').toString('utf8');
};

export const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export default {
  base64toUTF8,
  question,
  exists,
  EMAIL_REGEX
}
