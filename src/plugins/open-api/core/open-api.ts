import { SchemaType } from './schema';

export type VersionString = `${number}.${number}.${number}`;

export type ValidRef<Type extends string> = {
  $ref: ComponentsReference<Type>;
};
export type StatusCodes = 200 | 301 | 302 | 400 | 401 | 500;
export type RequestTypes = 'post' | 'get';
export type Example<Schema extends SchemaType> = {
  summary?: string;
  description?: string;
  value: SchemaToType<Schema>;
  externalValue?: string;
};
export type SchemaToType<Schema extends SchemaType> = any; // TODO
export type RequestReference<Type extends string = string> = Type extends
  | 'query.'
  | 'body#/'
  ? `{$request.${Type}${string}}`
  : never;

export type ComponentsReference<Type extends string = string> =
  `#/components/${Type}/${string}`;
// export type WebhooksReference = any;
export type OwRedirect<Type extends string = any> =
  // | WebhooksReference
  ComponentsReference<Type> | RequestReference<Type>;

export type Content<Schema extends SchemaType> = {
  [type in ContentType]?: {
    examples?: StringRecords<Example<Schema>, string>;
    schema: Schema;
  };
};

export type Response<
  Schema extends SchemaType = SchemaType,
  Headers extends string = string,
> = {
  description: string;
  headers?: StringRecords<Header | ValidRef<'headers'>, Headers>;
  content?: Content<Schema>;
};

export type Header<Schema extends SchemaType = SchemaType> = {
  description: string;
  schema: Schema;
};

export type SecuritySceme = {
  type: 'http';
  description: string;
} & (
  | {
      scheme: 'basic';
    }
  | {
      scheme: 'bearer';
      bearerFormat: 'JWT';
    }
);

export type Parameter =
  | {
      name: string;
      in: 'query' | 'cookie' | 'header' | 'path';
      required?: true;
      description: string;
      schema: SchemaType;
    }
  | ValidRef<'parameters'>;

export type Server = {
  description: string;
  url: string;
};

export enum ContentType {
  ApplicationJSON = 'application/json',
  URLEncodedForm = 'application/x-www-form-urlencoded',
}

export type StringRecords<Record, Keys extends string> = {
  // eslint-disable-next-line no-unused-vars
  [key in Keys]: Record;
};

export type Components<
  Responses extends string = any,
  Headers extends string = any,
  SecurityScemes extends string = any,
  Schemas extends string = any,
  Parameters extends string = any,
> = {
  responses?: StringRecords<Response, Responses>;
  headers?: StringRecords<Header, Headers>;
  securitySchemes?: StringRecords<SecuritySceme, SecurityScemes>;
  schemas?: StringRecords<SchemaType, Schemas>;
  parameters?: StringRecords<Parameter, Parameters>;
};

export type PathObject<
  Request extends RequestTypes,
  Tags extends string,
  Comps extends Components<any>,
  Paths extends string = string,
  Callbacks extends string = string,
> = {
  security?: {
    [schemes in keyof Comps['securitySchemes']]?: string[];
  }[];
  tags: Tags[];
  description: string;
  externalDocs?: {
    description: string;
    url: string;
  };
  parameters?: Parameter[];
  callbacks?: StringRecords<
    StringRecords<
      {
        [Request in RequestTypes]?: Pick<
          PathObject<Request, Tags, Comps>,
          'description' | 'parameters' | 'requestBody'
        >;
      },
      Paths
    >,
    Callbacks
  >;
  requestBody?: Request extends 'get'
    ? never
    : {
        required?: true;
        content: Content<SchemaType>;
      };
  responses: {
    [code in StatusCodes]?: Response | ValidRef<'responses'>;
  };
};

export type Path<Tags extends string, Comps extends Components<any>> = {
  [Request in RequestTypes]?: PathObject<Request, Tags, Comps>;
};

export type OpenAPISpec<
  Comps extends Components<any>,
  Tags extends string = string,
  Paths extends string = string,
> = {
  openapi: '3.1.0';
  'x-ow-version': '0.0.1';
  info: {
    title: string;
    description: string;
    version: VersionString;
  };
  components: Comps;
  servers: Server[];
  paths: StringRecords<Path<Tags, Comps>, Paths>;
};
