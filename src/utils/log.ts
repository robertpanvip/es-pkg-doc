import chalk from 'chalk';// 改变屏幕文字颜色
import timestamp from "time-stamp"

function getTimestamp() {
    return `[${chalk.gray(timestamp('HH:mm:ss'))}]`
}

export function log(content: string, ...rest: any[]) {
    const time = getTimestamp();
    process.stdout.write(time + ' ');
    console.log(chalk.gray([content, ...rest]));
}

export function success(content: string, ...rest: any[]) {
    const time = getTimestamp();
    process.stdout.write(time + ' ');
    console.log(chalk.green([content, ...rest]));
}

export function warn(content: string, ...rest: any[]) {
    const time = getTimestamp();
    process.stdout.write(time + ' ');
    console.log(chalk.yellow([content, ...rest]));
}

export function info(content: string, ...rest: any[]) {
    const time = getTimestamp();
    process.stdout.write(time + ' ');
    console.log(chalk.magenta([content, ...rest]));
}

export function error(content: string, ...rest: any[]) {
    const time = getTimestamp();
    process.stdout.write(time + ' ');
    console.log(chalk.red([content, ...rest]));
}

log.success = success;
log.debug = log;
log.warn = warn;
log.info = info;
log.error = error;
export default log;