import request from "supertest";
import httpStatus from "http-status";
import { app } from "../../src/app";
import config from "../../src/config/config";

describe("Docs routes", () => {
  describe("GET /v1/docs", () => {
    // This test does not work, as the routes are not attached again after changing the ENV, therefore we get an 404

    // test("should return 200 when running in development", async () => {
    //   config.NODE_ENV = "development";
    //   await request(app).get("/v1/docs/").send().expect(httpStatus.OK);
    //   config.NODE_ENV = process.env.NODE_ENV as typeof config.NODE_ENV;
    // });

    test("should return 404 when running in production", async () => {
      config.NODE_ENV = "production";
      await request(app).get("/v1/docs/").send().expect(httpStatus.NOT_FOUND);
      config.NODE_ENV = process.env.NODE_ENV as typeof config.NODE_ENV;
    });

    // Same error as above
    // This test does not work, as the routes are not attached again after changing the ENV, therefore we get an 404

    // test("should return 200 when running in production but PUBLIC_API_DOCUMENTATION is set", async () => {
    //   config.NODE_ENV = "production";
    //   config.PUBLIC_API_DOCUMENTATION = "true";
    //   console.log(config.PUBLIC_API_DOCUMENTATION);
    //   await request(app).get("/v1/docs/").send().expect(httpStatus.OK);
    //   config.NODE_ENV = process.env.NODE_ENV as typeof config.NODE_ENV;
    // });
  });
});
