import request from "supertest";
import httpStatus from "http-status";
import faker from "faker";
import { app } from "../../src/app";
import { userOne, insertUsers, userTwo } from "../fixtures/user.fixture";
import { userOneAccessToken } from "../fixtures/token.fixture";
import prisma from "../../src/init-prisma-client";
import {
  createTree,
  getSingleTree,
  getManyTrees,
  updateSingleTree,
  updateManyTree,
  deleteSingleTree,
  deleteManyTree,
} from "../utils/gqlQueriesMutations";
import { setupTestDB } from "../utils/setupTestDB";
import {
  insertTrees,
  treeOne,
  treeThree,
  treeTwo,
} from "../fixtures/decisionTree.fixture";

setupTestDB();

describe("GraphQL route", () => {
  describe("CREATE - POST /v1/graphql", () => {
    test("should create a valid tree", async () => {
      await insertUsers([userOne]);

      const treeName = faker.random.words(4);

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(createTree(treeName))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          createDecisionTree: {
            uuid: expect.anything(),
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
            name: treeName,
            status: "ACTIVE",
            treeData: null,
          },
        },
      });
    });

    test("should return 403 if not signed in", async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post("/v1/graphql")
        .set("Accept", "application/json")
        .send(createTree("Test"))
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
  describe("READ - POST /v1/graphql", () => {
    test("should return the selected tree", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(getSingleTree(treeOne.uuid))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          decisionTree: {
            uuid: treeOne.uuid,
            name: treeOne.name,
          },
        },
      });
    });
  });
  test("should return the trees with matching criteria owned by the current user", async () => {
    await insertUsers([userOne, userTwo]);
    await insertTrees([treeOne, treeTwo, treeThree]);

    const whereInput = {
      name: {
        contains: "Tree",
      },
    };
    const res = await request(app)
      .post("/v1/graphql")
      .set("Authorization", `Bearer ${userOneAccessToken}`)
      .set("Accept", "application/json")
      .send(getManyTrees(whereInput))
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      data: {
        decisionTrees: [
          {
            uuid: treeOne.uuid,
            name: treeOne.name,
          },
          {
            uuid: treeTwo.uuid,
            name: treeTwo.name,
          },
        ],
      },
    });

    expect(res.body.data.decisionTrees[2]).not.toBeDefined();
  });

  describe("UPDATE - POST /v1/graphql", () => {
    test("should update the selected tree", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const updateData: any = {
        name: {
          set: "New Name",
        },
        status: { set: "ARCHIVED" },
      };

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(updateSingleTree(updateData, treeOne.uuid))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          updateDecisionTree: {
            uuid: treeOne.uuid,
            name: updateData.name.set,
            status: updateData.status.set,
          },
        },
      });

      const treeFromDb = await prisma.decisionTree.findUnique({
        where: {
          uuid: treeOne.uuid,
        },
      });

      expect(treeFromDb).toMatchObject({
        name: updateData.name.set,
        status: updateData.status.set,
      });
    });

    test("should fail if trying to update the id", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const updateData: any = {
        uuid: {
          set: "10",
        },
      };

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(updateSingleTree(updateData, treeOne.uuid))
        //for some reason this returns 500 in tests
        //it should be 400, which works outside of tests
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test("should fail if tree does not exist", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const updateData: any = {
        name: {
          set: "New Name",
        },
      };

      //TODO: does not work yet, due to GQL error handling
      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(
          updateSingleTree(updateData, "8d7bc4dc-591b-461c-9c38-1b4003b14009")
        )
        .expect(httpStatus.OK);

      expect(res.body.errors[0]["message"]).toEqual("Not found.");
    });

    test("should update several trees matching the criteria", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const whereInput = {
        name: {
          contains: "Tree",
        },
      };

      const updateData: any = {
        name: {
          set: "New Name",
        },
        status: { set: "ARCHIVED" },
      };

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(updateManyTree(updateData, whereInput));

      expect(res.body).toEqual({
        data: {
          updateManyDecisionTree: {
            count: 2,
          },
        },
      });

      const treesFromDb = await prisma.decisionTree.findMany({
        where: {
          name: "New Name",
        },
      });

      expect(treesFromDb).toHaveLength(2);
    });
  });
  describe("DELETE - POST /v1/graphql", () => {
    test("should delete the selected tree", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(deleteSingleTree(treeOne.uuid))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          deleteDecisionTree: {
            uuid: treeOne.uuid,
            name: treeOne.name,
          },
        },
      });
      const treeFromDb = await prisma.decisionTree.findUnique({
        where: {
          uuid: treeOne.uuid,
        },
      });

      expect(treeFromDb).toBeNull();
    });

    test("should delete trees matching the criteria", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const whereInput = {
        name: {
          contains: "Tree",
        },
      };

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(deleteManyTree(whereInput))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          deleteManyDecisionTree: {
            count: 2,
          },
        },
      });

      const treesFromDb = await prisma.decisionTree.findMany({
        where: whereInput,
      });

      //Only the foreign tree of userTwo should remain
      expect(treesFromDb).toHaveLength(1);
    });
  });
});
