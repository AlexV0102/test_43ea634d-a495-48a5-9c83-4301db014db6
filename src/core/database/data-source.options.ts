export type ConfigLike = {
  get(key: string, defaultValue?: unknown): unknown;
};

export function getDataSourceOptions(config?: ConfigLike) {
  const get = (key: string, def: string): string => {
    if (config == null) return process.env[key] ?? def;
    const v = config.get(key, def);
    if (v === null || v === undefined) return def;
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return def;
  };
  const getNum = (key: string, def: number): number =>
    config != null
      ? Number(config.get(key, def)) || def
      : parseInt(process.env[key] ?? '', 10) || def;

  return {
    type: 'postgres' as const,
    host: get('DB_HOST', 'localhost'),
    port: getNum('DB_PORT', 5432),
    username: get('DB_USER', 'postgres'),
    password: get('DB_PASSWORD', ''),
    database: get('DB_NAME', 'postgres'),
    synchronize: false,
  };
}
