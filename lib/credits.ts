// /lib/credits.ts
/*import { getPool, sql } from './db';
import crypto from 'crypto';

export async function tryConsumeCredit(opts: { userId: number; idemKey?: string }) {
  const pool = await getPool();
  const idemKey = opts.idemKey || crypto.randomBytes(16).toString('hex');

  const result = await pool.request()
    .input('user_id', sql.Int, opts.userId)
    .input('idem_key', sql.NVarChar(128), idemKey)
    .input('op', sql.NVarChar(64), 'generate_report')
    .output('ok', sql.Bit)
    .output('reason', sql.NVarChar(100))
    .execute('dbo.try_consume_credit');

  const ok = Boolean(result.output.ok);
  const reason = String(result.output.reason || '');
  return { ok, reason, idemKey };
}*/
