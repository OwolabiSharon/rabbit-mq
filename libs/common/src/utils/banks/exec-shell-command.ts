import { exec } from 'child_process';

export const ExecShellCommand = async (cmd: string) =>
  new Promise((resolve, reject) => {
    exec(cmd, (err: any, stdout, stderr) => {
      if (err) {
        console.log(`${cmd} command failed: Reason: ${err.message}: Caused by: ${err.cause}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });

export default ExecShellCommand;
