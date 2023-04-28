import * as fs from 'fs';
import * as path from 'path';

import { envType } from './types/env';

const currentEnv = process.env.NODE_ENV === 'production';

// 获取环境配置文件
function parseEnv(): envType {
  const localEnv: string = path.resolve(__dirname, '../../.env.development');
  const prodEnv: string = path.resolve(__dirname, '../../.env.production');

  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('缺少环境配置文件');
  }

  const filePath: string = currentEnv && fs.existsSync(prodEnv) ? prodEnv : localEnv;
  return { path: filePath };
}

export default parseEnv();
