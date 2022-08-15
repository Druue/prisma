import { convertType, generateModel, Type } from "./main.ts";
import {
  assert,
  assertThrows,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";

Deno.test("Generate Model", () => {
  const model = "model test {\n\tid Int @id\n}\n";

  const res = generateModel("test", [
    {
      columnId: 0,
      name: "id",
      type: Type.INTEGER,
      nullable: false,
      default: "",
      isPrimary: true,
    },
  ]);

  assert(model === res);
});

const happyTypeTests = [
  { sqlType: "TEXT", prismaType: "String" },
  { sqlType: "BOOLEAN", prismaType: "Boolean" },
  { sqlType: "INTEGER", prismaType: "Int" },
  { sqlType: "DATETIME", prismaType: "DateTime" },
  { sqlType: "REAL", prismaType: "Float" },
];

Deno.test("Convert Types : Happy", () => {
  happyTypeTests.forEach((test) =>
    assert(test.prismaType === convertType(test.sqlType))
  );
});
