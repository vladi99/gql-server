const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

// GraphQL schema
const schema = buildSchema(`
    type Query {
        rental(id: String!): Rental
        rentals(city: String): [Rental]
    },
    type Rental {
        id: String
        type: String
        title: String
        owner: String
        city: String
        category: String
        bedrooms: Int
        image: String
        description: String
    },
    type Mutation {
        updateRentalTitle(id: String!, title: String!): Rental
    }
`);

const rentalsData = [
  {
    type:        'rentals',
    id:          'grand-old-mansion',
    title:       "Grand Old Mansion",
    owner:       "Veruca Salt",
    city:        "San Francisco",
    category:    "Estate",
    bedrooms:    15,
    image:       "https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg",
    description: "This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests."
  },
  {
    type:        'rentals',
    id:          'urban-living',
    title:       "Urban Living",
    owner:       "Mike Teavee",
    city:        "Seattle",
    category:    "Condo",
    bedrooms:    1,
    image:       "https://upload.wikimedia.org/wikipedia/commons/0/0e/Alfonso_13_Highrise_Tegucigalpa.jpg",
    description: "A commuters dream. This rental is within walking distance of 2 bus stops and the Metro."
  },
  {
    type:        'rentals',
    id:          'downtown-charm',
    title:       "Downtown Charm",
    owner:       "Violet Beauregarde",
    city:        "Portland",
    category:    "Apartment",
    bedrooms:    3,
    image:       "https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg",
    description: "Convenience is at your doorstep with this charming downtown rental. Great restaurants and active " +
                   "night life are within a few feet."
  }
];

const updateRentalTitle = ({ id, title }) => {
  const rental = rentalsData.find(course => course.id === id);
  rental.title = title;
  return rental;
};

const getRental = (args) => {
  return rentalsData.find(rental => rental.id === args.id);
};

const getRentals = (args) => {
  if (args.city) {
    return rentalsData.filter((rental) => {
      return rental.city.toLowerCase().includes(args.city.toLowerCase());
    })
  } else {
    return rentalsData
  }
};

const root = {
  rental:            getRental,
  rentals:           getRentals,
  updateRentalTitle: updateRentalTitle
};
// Create an express server and a GraphQL endpoint
const app = express();
app.use(cors());
app.use('/graphql', express_graphql({
  schema:    schema,
  rootValue: root,
  graphiql:  true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
