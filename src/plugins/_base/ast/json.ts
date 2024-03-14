export type JsonToAst<Value> = Value extends object | Array<any>
  ? {
      /** The formal key for this property */
      _nodeKey: string;
      /** The node name for this property */
      _nodeName?: string;
      /** This node's position in its parent property */
      _idInParent?: number;
      /** Optional extra metadata for this node */
      props?: any;
    } & (Value extends Array<infer Item>
      ? {
          /** The different named child properties of this node */
          members: JsonToAst<Item>[];
        }
      : {
          /** The child nodes of this node */
          children: {
            [key in keyof Value]: JsonToAst<Value[key]>;
          };
        })
  : Value;
