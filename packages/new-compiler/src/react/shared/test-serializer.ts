import type { SnapshotSerializer } from "vitest";

const serializer: SnapshotSerializer = {
  serialize(val, config, indentation, depth, refs, printer) {
    console.warn("Serializing React element:", {
      type: typeof val.type,
      typeValue: val.type,
      isFragment: val.type === Symbol.for("react.fragment"),
      key: val.key,
      hasChildren: !!val.props?.children,
    });

    // Clone the element to avoid modifying the original
    const clone = { ...val };

    clone.props = {
      "data-test": 1,
    };

    // If there's a key prop, include it in the props
    if (val.key != null) {
      clone.props = {
        ...clone.props,
        "data-key": val.key, // Use data-key to make it visible in snapshots
      };
    }

    // Use default printer for the rest
    return printer(clone, config, indentation, depth, refs);
  },
  test(val) {
    // Match any React element (including Fragments)
    const isReactElement =
      val &&
      typeof val === "object" &&
      val.$$typeof === Symbol.for("react.element");
    if (isReactElement) {
      console.warn("Serializer test matched:", {
        type: typeof val.type,
        typeValue: val.type,
        isFragment: val.type === Symbol.for("react.fragment"),
      });
    }
    return isReactElement;
  },
};

export default serializer;
