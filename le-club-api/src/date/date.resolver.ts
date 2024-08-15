import { GraphQLScalarType } from "graphql";

const GraphQLDate = new GraphQLScalarType({
  name: 'Date',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
});

export default GraphQLDate;