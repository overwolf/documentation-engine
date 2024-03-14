import React, { useContext } from 'react';
import { FormatStringSchemas, ParsedSchemaType } from '../../core/schema';
import componentFromRef from '../../core/ref';
import { ComponentsContext } from '../contexts/components';
import { Components } from '../../core/open-api';

function Schema({ data }: { data: ParsedSchemaType }) {
  const components = useContext(ComponentsContext);
  // ---------------------------------------------------------------------------

  return (
    <div className="type">
      {SchemaToInsideSchema(
        componentFromRef(data, components) as ParsedSchemaType,
        components,
      )}
    </div>
  );
}

function SchemaToInsideSchema(
  schema: ParsedSchemaType,
  components: Components,
  counter = 0,
): string {
  if (schema.oneOf)
    return schema.oneOf
      .map(
        (s) =>
          `(${SchemaToInsideSchema(
            s as ParsedSchemaType,
            components,
            counter + 1,
          )})`,
      )
      .join(`  |\n${Spacing(counter)}`);
  switch (schema.type) {
    case 'string':
      if (schema.enum)
        return `[${schema.enum.map((value) => `"${value}"`).join(', ')}]`;
      // eslint-disable-next-line no-case-declarations
      const format = (schema as FormatStringSchemas).format;
      return `string${format ? ` (${format})` : ''}`;
    case 'number':
      if (schema.enum) return `[${schema.enum.join(', ')}]`;
      return 'number';
    case 'object':
      return `\n${Spacing(counter)}{\n${Object.keys(schema.properties)
        .map(
          (key: string) =>
            `${Spacing(counter + 1)}"${key}": ${SchemaToInsideSchema(
              componentFromRef<'schemas'>(
                schema.properties[key] as ParsedSchemaType,
                components,
              ),
              components,
              counter + 1,
            )},\n`,
        )
        .join('')}${Spacing(counter)}}\n`;
  }
}

const Spacing = (counter: number) => '    '.repeat(counter);

export default Schema;
