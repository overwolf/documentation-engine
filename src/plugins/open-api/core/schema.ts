import { OwRedirect, ValidRef } from './open-api';

type ObjectSchema<Fields extends string = any> = {
  type: 'object';
  required?: Fields[];
  properties?: {
    [key in Fields]: SchemaType;
  };
};

// type BooleanSchema = {
//   type: 'boolean';
// };

type NumberSchema = {
  type: 'number';
} & EnumSchema<number>;

type StringSchema = ({
  type: 'string';
  pattern?: string;
} & EnumSchema<string>) &
  (FormatStringSchemas | {});

export type FormatStringSchemas = {
  'x-ow-redirect'?: OwRedirect;
  format: 'uri';
};

type EnumSchema<EnumType> = {
  enum?: EnumType[];
};

export type ParsedSchemaType = {
  description?: string;
  oneOf?: readonly SchemaType[];
  examples?: any[];
} & (ObjectSchema | NumberSchema | StringSchema);

export type SchemaType = ParsedSchemaType | ValidRef<'schemas'>;
