import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma-client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("DecisionTreeWhereUniqueInput", {
  isAbstract: true,
})
export class DecisionTreeWhereUniqueInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
  uuid?: string | undefined;
}
