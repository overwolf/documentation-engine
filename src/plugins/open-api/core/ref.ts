import { Components, ComponentsReference, ValidRef } from './open-api';

export default function componentFromRef<Type extends keyof Components>(
  potentialRef: Components[Type][keyof Components[Type]] | ValidRef<Type>,
  components: Components,
): Exclude<typeof potentialRef, ValidRef<Type>> {
  const ref: ComponentsReference<Type> = (potentialRef as ValidRef<Type>).$ref;
  if (!ref) return potentialRef as Exclude<typeof potentialRef, ValidRef<Type>>;
  const paths = ref.split('/');
  const componentType = components[paths[2] as Type];
  if (!componentType)
    throw new Error(`No components of type ${paths[2]} exist for this object!`);

  return componentFromRef(
    componentType[paths[3] as keyof Components[Type]] as
      | typeof potentialRef
      | ValidRef<Type>,
    components,
  );
}
