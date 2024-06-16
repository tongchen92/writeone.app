import { loadConfigByName } from "@/app/actions";

describe("loadConfigByApplicationName", () => {
  it("should load a config by name", () => {
    const config = loadConfigByName("DevelopmentTest");
    expect(config?.name).toEqual("DevelopmentTest");
  });

  it("if name does not exist, expect error", () => {
    expect(() => loadConfigByName("nonExistent")).toThrowError(
      "Config with name nonExistent not found"
    );
  });
});
