/* eslint-disable @typescript-eslint/no-empty-function */
import { LoggerService } from '@nestjs/common';
import { exec } from 'child_process';

export class Exec implements LoggerService {
  static _instance = new Exec();
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.debug(message, ...optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {}

  ExecShellCommand = async (cmd: string) =>
    new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          this.error(`${cmd} command failed: Reason: ${err.message}`);
          return;
        }
        if (stderr) {
          this.error(`stderr: ${stderr}`);
          return;
        }
        resolve(stdout);
      });
    });
}
