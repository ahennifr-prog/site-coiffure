import { DatabaseSync } from "node:sqlite";
import type { D1Like, D1Statement } from "@/lib/db";

/** Base D1 simulée avec SQLite (Node) pour les tests. */
export function sqliteD1(): D1Like {
  const db = new DatabaseSync(":memory:");
  return {
    prepare(sql: string) {
      let args: unknown[] = [];
      const stmt: D1Statement = {
        bind(...values: unknown[]) {
          args = values.map((v) => (v === undefined ? null : v));
          return stmt;
        },
        async run() {
          if (/^\s*(CREATE|DROP)/i.test(sql) && args.length === 0) {
            db.exec(sql);
            return { meta: { changes: 0 } };
          }
          const r = db.prepare(sql).run(...(args as never[]));
          return { meta: { changes: Number(r.changes) } };
        },
        async all<T>() {
          return { results: db.prepare(sql).all(...(args as never[])) as T[] };
        },
        async first<T>() {
          return (db.prepare(sql).get(...(args as never[])) as T | undefined) ?? null;
        },
      };
      return stmt;
    },
  };
}
