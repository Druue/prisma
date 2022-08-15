import { DB, Row } from "https://deno.land/x/sqlite@v3.4.0/mod.ts";

interface Details {
  columnId: number;
  name: string;
  type: string;
  nullable: boolean;
  default: string;
  isPrimary: boolean;
}

const convertToDetails = (row: Row): Details => ({
  columnId: row[0] as number,
  name: row[1] as string,
  type: row[2] as string,
  nullable: row[3] as boolean,
  default: row[4] as string,
  isPrimary: row[5] as boolean,
});

const getTableInfo = (tableName: string, db: DB) =>
  db.query("SELECT * FROM pragma_table_info(?)", [tableName]);

const getTableNames = (db: DB) =>
  db.query<[string]>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
  );

const formatLine = (details: Details) =>
  `${details.name} ${details.type}${details.nullable ? "?" : ""} ${
    details.isPrimary ? "@Id" : ""
  }`;

const generateModel = (name: string, details?: Details[]) => {
  return `model ${name} {\n\t${
    details ? details.map((d) => `${formatLine(d)}`).join("\n\t") : ""
  }\n}\n`;
};

const db = new DB("example.sqlite");

const names = getTableNames(db);
const models: string[] = names.map(([name]) => {
  const rows = getTableInfo(name, db);
  const details = rows.map((row) => convertToDetails(row));
  return generateModel(name, details);
});

await Deno.writeTextFile("./models.prisma", models.join("\n"));