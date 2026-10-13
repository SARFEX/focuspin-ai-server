import { describe, expect, test } from 'bun:test';
import { loadConfig } from './config.ts';

/** Минимальный валидный набор: тестовое окружение + все обязательные числа. */
const BASE_ENV: Record<string, string> = {
  APP_ENV: 'test',
  GLOBAL_MAX_INFLIGHT: '8',
  GLOBAL_DAILY_REQUEST_CAP: '1000',
  GLOBAL_DAILY_TOKEN_CAP: '1000000',
  LIMIT_IP_MINUTE: '15',
  LIMIT_IP_HOUR: '60',
  LIMIT_IP_DAY: '300',
  LIMIT_SUBNET_DAY: '1200',
  LIMIT_IP_DISTINCT_DEVICES_DAY: '6',
  LIMIT_DEVICE_MINUTE: '6',
  LIMIT_DEVICE_HOUR: '15',
  LIMIT_DEVICE_DAY: '50',
  LIMIT_FRESH_DEVICE_HOURS: '24',
  LIMIT_FRESH_DEVICE_DAY: '15',
  LIMIT_CONTRACT_FAILS_PER_HOUR: '10',
};

describe('config', () => {
  test('минимальный набор собирается', () => {
    const config = loadConfig(BASE_ENV);
    expect(config.env).toBe('test');
    expect(config.limits.deviceDay).toBe(50);
    expect(config.globalDailyRequestCap).toBe(1000);
  });

  test.each(['LIMIT_DEVICE_DAY', 'GLOBAL_DAILY_REQUEST_CAP'])('%s обязателен: без значения конфиг не собирается', (name) => {
    const env = { ...BASE_ENV };
    delete env[name];
    expect(() => loadConfig(env)).toThrow(`${name} is required (no default)`);
  });
});
