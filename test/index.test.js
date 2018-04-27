import outlineHider from "../src";

describe("outlineHider", () => {
  it("should return a function", () => {
    const result:Function = outlineHider()

    expect(typeof result).toBe('function')
  });

  // TODO: mock document and confirm event removal works
  // TODO: simulate click trigger adds custom outline style
  // TODO: simulate keyboard focus removes custom outline style
});
