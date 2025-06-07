import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LingoComponent } from "./component";

describe("LingoComponent", () => {
  const dictionary = {
    files: {
      messages: {
        entries: {
          greeting: "Hello {user.profile.name} you have {count} messages",
          welcome:
            "Welcome <element:a>incredible <element:span>fantastic <element:em>wonderful <element:strong>amazing</element:strong></element:em></element:span> user</element:a>",
          complex:
            "<element:a>Hello {user.profile.name}, welcome to <element:span>wonderful <element:strong><element:em>{placeholder}</element:em> nested</element:strong></element:span> world</element:a> of the <element:u>universe number {count}</element:u>",
        },
      },
    },
  };

  it("replaces variables in text", () => {
    const { container } = render(
      <LingoComponent
        $dictionary={dictionary}
        $as="div"
        $fileKey="messages"
        $entryKey="greeting"
        $variables={{ "user.profile.name": "John", count: 69 }}
      />,
    );
    expect(container.textContent).toBe("Hello John you have 69 messages");
  });

  it("replaces variables with JSX", () => {
    const { container } = render(
      <LingoComponent
        $dictionary={dictionary}
        $as="div"
        $fileKey="messages"
        $entryKey="greeting"
        $variables={{
          "user.profile.name": <strong>John</strong>,
          count: <em>69</em>,
        }}
      />,
    );
    expect(container.innerHTML).toBe(
      "<div>Hello <strong>John</strong> you have <em>69</em> messages</div>",
    );
  });

  it("replaces element placeholders", () => {
    const { container } = render(
      <LingoComponent
        $dictionary={dictionary}
        $as="div"
        $fileKey="messages"
        $entryKey="welcome"
        $elements={[
          ({ children }: any) => <a href="#">{children}</a>,
          ({ children }: any) => <span>{children}</span>,
          ({ children }: any) => <em>{children}</em>,
          ({ children }: any) => <strong className="red">{children}</strong>,
        ]}
      />,
    );
    expect(container.innerHTML).toBe(
      '<div>Welcome <a href="#">incredible <span>fantastic <em>wonderful <strong class="red">amazing</strong></em></span> user</a></div>',
    );
  });

  it("handles both variables and elements", () => {
    const { container } = render(
      <LingoComponent
        $dictionary={dictionary}
        $as="div"
        $fileKey="messages"
        $entryKey="complex"
        $variables={{
          "user.profile.name": "John",
          count: 42,
          placeholder: "very",
        }}
        $elements={[
          ({ children }: any) => <a>{children}</a>,
          ({ children }: any) => <span>{children}</span>,
          ({ children }: any) => <strong>{children}</strong>,
          ({ children }: any) => <em>{children}</em>,
          ({ children }: any) => <u>{children}</u>,
        ]}
      />,
    );
    expect(container.innerHTML).toBe(
      "<div><a>Hello John, welcome to <span>wonderful <strong><em>very</em> nested</strong></span> world</a> of the <u>universe number 42</u></div>",
    );
  });

  it("falls back to entryKey if value not found", () => {
    const { container } = render(
      <LingoComponent
        $dictionary={dictionary}
        $as="div"
        $fileKey="messages"
        $entryKey="nonexistent"
        $variables={{}}
        $elements={[]}
      />,
    );
    expect(container.textContent).toBe("nonexistent");
  });

  describe("function replacement", () => {
    const getName = () => "John";
    const getCount = () => 42;
    const formatName = () => "John Doe";
    const getUnread = () => 3;
    const fnDictionary = {
      files: {
        messages: {
          entries: {
            simple:
              "Hello <function:getName/>, you have <function:getCount/> items",
            chained: "Hello <function:user.details.profile.name/>",
            mixed:
              "Welcome <function:formatName/>, you have {count} items and <function:getUnread/> unread",
            nested:
              "<element:strong>User <function:getName/></element:strong> has <element:em><function:getCount/></element:em>",
          },
        },
      },
    };

    it("replaces function calls in text", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={fnDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="simple"
          $functions={{
            getName: [getName()],
            getCount: [getCount()],
          }}
        />,
      );
      expect(container.textContent).toBe("Hello John, you have 42 items");
    });

    it("handles mixed variables and functions", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={fnDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="mixed"
          $variables={{
            count: 5,
          }}
          $functions={{
            formatName: [formatName()],
            getUnread: [getUnread()],
          }}
        />,
      );
      expect(container.textContent).toBe(
        "Welcome John Doe, you have 5 items and 3 unread",
      );
    });

    it("handles functions with nested elements", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={fnDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="nested"
          $functions={{
            getName: [getName()],
            getCount: [getCount()],
          }}
          $elements={[
            ({ children }: any) => <strong>{children}</strong>,
            ({ children }: any) => <em>{children}</em>,
          ]}
        />,
      );
      expect(container.innerHTML).toBe(
        "<div><strong>User John</strong> has <em>42</em></div>",
      );
    });

    it("handles function with chained names", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={fnDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="chained"
          $functions={{
            "user.details.profile.name": [getName()],
          }}
        />,
      );
      expect(container.textContent).toBe("Hello John");
    });

    it("preserves function placeholder if function not provided", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={fnDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="simple"
          $functions={{
            getName: [getName()],
            // fn1:getCount not provided
          }}
        />,
      );
      expect(container.textContent).toBe(
        "Hello John, you have <function:getCount/> items",
      );
    });

    it("replaces function calls with JSX", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={fnDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="simple"
          $functions={{
            getName: [<strong>John</strong>],
            getCount: [<em>42</em>],
          }}
        />,
      );
      expect(container.innerHTML).toBe(
        "<div>Hello <strong>John</strong>, you have <em>42</em> items</div>",
      );
    });
  });

  describe("expression replacement", () => {
    const exprDictionary = {
      files: {
        messages: {
          entries: {
            simple: "Result: <expression/>",
            multiple: "First: <expression/>, Second: <expression/>",
            mixed:
              "Count: <expression/>, User: {user.name}, Items: <expression/>",
            nested:
              "<element:strong>Value: <expression/></element:strong> and <element:em>Total: <expression/></element:em>",
          },
        },
      },
    };

    it("replaces simple expressions", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={exprDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="simple"
          $expressions={[42]}
        />,
      );
      expect(container.textContent).toBe("Result: 42");
    });

    it("handles multiple expressions", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={exprDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="multiple"
          $expressions={[42 * 2, "hello".toUpperCase()]}
        />,
      );
      expect(container.textContent).toBe("First: 84, Second: HELLO");
    });

    it("handles mixed variables and expressions", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={exprDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="mixed"
          $variables={{
            "user.name": "John",
          }}
          $expressions={[42 + 1, [1, 2, 3].length]}
        />,
      );
      expect(container.textContent).toBe("Count: 43, User: John, Items: 3");
    });

    it("handles expressions with nested elements", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={exprDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="nested"
          $expressions={[42 * 2, [1, 2, 3].reduce((a, b) => a + b, 0)]}
          $elements={[
            ({ children }: any) => <strong>{children}</strong>,
            ({ children }: any) => <em>{children}</em>,
          ]}
        />,
      );
      expect(container.innerHTML).toBe(
        "<div><strong>Value: 84</strong> and <em>Total: 6</em></div>",
      );
    });

    it("preserves expression placeholder if not provided", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={exprDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="multiple"
          $expressions={[
            42,
            // second expression not provided
          ]}
        />,
      );
      expect(container.textContent).toBe("First: 42, Second: <expression/>");
    });

    it("replaces expressions with JSX", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={exprDictionary}
          $as="div"
          $fileKey="messages"
          $entryKey="multiple"
          $expressions={[<strong>foo</strong>, <code>bar</code>]}
        />,
      );
      expect(container.innerHTML).toBe(
        "<div>First: <strong>foo</strong>, Second: <code>bar</code></div>",
      );
    });
  });

  describe("array mutation prevention (shift() bug fix)", () => {
    const mutationDictionary = {
      files: {
        test: {
          entries: {
            elements: "First <element:0>text</element:0> and <element:1>more</element:1>",
            functions: "Call <function:fn1/> then <function:fn2/>",
            expressions: "Value <expression/> and <expression/>",
            mixed: "Element <element:0>content</element:0> with <function:fn1/> and <expression/>",
          },
        },
      },
    };

    it("does not mutate elements array during processing", () => {
      const elements = [
        ({ children }: any) => <span>{children}</span>,
        ({ children }: any) => <strong>{children}</strong>,
      ];
      const originalElements = [...elements];

      render(
        <LingoComponent
          $dictionary={mutationDictionary}
          $as="div"
          $fileKey="test"
          $entryKey="elements"
          $elements={elements}
        />,
      );

      expect(elements).toEqual(originalElements);
      expect(elements.length).toBe(2);
    });

    it("does not mutate functions arrays during processing", () => {
      const functions = {
        fn1: ["result1", "result2"],
        fn2: ["result3", "result4"],
      };
      const originalFunctions = {
        fn1: [...functions.fn1],
        fn2: [...functions.fn2],
      };

      render(
        <LingoComponent
          $dictionary={mutationDictionary}
          $as="div"
          $fileKey="test"
          $entryKey="functions"
          $functions={functions}
        />,
      );

      expect(functions.fn1).toEqual(originalFunctions.fn1);
      expect(functions.fn2).toEqual(originalFunctions.fn2);
      expect(functions.fn1.length).toBe(2);
      expect(functions.fn2.length).toBe(2);
    });

    it("does not mutate expressions array during processing", () => {
      const expressions = ["value1", "value2"];
      const originalExpressions = [...expressions];

      render(
        <LingoComponent
          $dictionary={mutationDictionary}
          $as="div"
          $fileKey="test"
          $entryKey="expressions"
          $expressions={expressions}
        />,
      );

      expect(expressions).toEqual(originalExpressions);
      expect(expressions.length).toBe(2);
    });

    it("produces consistent output across multiple renders", () => {
      const elements = [
        ({ children }: any) => <span>{children}</span>,
        ({ children }: any) => <strong>{children}</strong>,
      ];
      const functions = { fn1: ["result1"] };
      const expressions = ["value1"];

      const { container: container1 } = render(
        <LingoComponent
          $dictionary={mutationDictionary}
          $as="div"
          $fileKey="test"
          $entryKey="mixed"
          $elements={elements}
          $functions={functions}
          $expressions={expressions}
        />,
      );

      const { container: container2 } = render(
        <LingoComponent
          $dictionary={mutationDictionary}
          $as="div"
          $fileKey="test"
          $entryKey="mixed"
          $elements={elements}
          $functions={functions}
          $expressions={expressions}
        />,
      );

      expect(container1.innerHTML).toBe(container2.innerHTML);
    });

    it("handles shared arrays across multiple component instances", () => {
      const sharedElements = [
        ({ children }: any) => <span>{children}</span>,
        ({ children }: any) => <strong>{children}</strong>,
      ];

      const { container: container1 } = render(
        <div>
          <LingoComponent
            $dictionary={mutationDictionary}
            $as="div"
            $fileKey="test"
            $entryKey="elements"
            $elements={sharedElements}
          />
        </div>,
      );

      const { container: container2 } = render(
        <div>
          <LingoComponent
            $dictionary={mutationDictionary}
            $as="div"
            $fileKey="test"
            $entryKey="elements"
            $elements={sharedElements}
          />
        </div>,
      );

      expect(container1.innerHTML).toBe(container2.innerHTML);
      expect(sharedElements.length).toBe(2);
    });

    it("extracts inner content when elements array is exhausted", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={mutationDictionary}
          $as="div"
          $fileKey="test"
          $entryKey="elements"
          $elements={[({ children }: any) => <span>{children}</span>]}
        />,
      );

      expect(container.textContent).toBe("First text and more");
      expect(container.innerHTML).toBe("<div>First <span>text</span> and more</div>");
    });

    it("handles completely empty elements array gracefully", () => {
      const { container } = render(
        <LingoComponent
          $dictionary={mutationDictionary}
          $as="div"
          $fileKey="test"
          $entryKey="elements"
          $elements={[]}
        />,
      );

      expect(container.textContent).toBe("First text and more");
      expect(container.innerHTML).toBe("<div>First text and more</div>");
    });

    it("maintains function index tracking per function name", () => {
      const multiCallDictionary = {
        files: {
          test: {
            entries: {
              multiCall: "First <function:fn1/>, second <function:fn1/>, third <function:fn2/>",
            },
          },
        },
      };

      const { container } = render(
        <LingoComponent
          $dictionary={multiCallDictionary}
          $as="div"
          $fileKey="test"
          $entryKey="multiCall"
          $functions={{
            fn1: ["A", "B"],
            fn2: ["C"],
          }}
        />,
      );

      expect(container.textContent).toBe("First A, second B, third C");
    });
  });
});
