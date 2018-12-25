import axios from 'axios';
import { GraphQLServer } from 'graphql-yoga';

const apiBase = 'https://api.iextrading.com/1.0/';

const getSymbols = async () => {
  const { data } = await axios.get(`${apiBase}ref-data/symbols`);
  return data.slice(0, 10); // Slice to get rid of HTTP 429 Too Many Request error
};

const getPrice = async (symbol) => {
  const { data } = await axios.get(`${apiBase}stock/${symbol}/price`);
  console.log(data);
  return data;
};


const resolvers = {
  Query: {
    symbols: () => getSymbols(),
  },
  Symbol: {
    price: (parent) => {
      const { symbol } = parent;
      return getPrice(symbol);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
});

server.start(() => console.log('Server is running on http://localhost:4000'));
