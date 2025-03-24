// sampleLocations.js
const locations = [
  {
    id: 1,
    type: "country",
    name: "United States",
    children: [
      {
        id: 2,
        type: "region",
        name: "California",
        parentId: 1,
        children: [
          {
            id: 3,
            type: "city",
            name: "Los Angeles",
            parentId: 2,
            children: [
              {
                id: 4,
                type: "area",
                name: "Hollywood",
                parentId: 3,
              },
              {
                id: 5,
                type: "area",
                name: "Beverly Hills",
                parentId: 3,
              },
            ],
          },
          {
            id: 6,
            type: "city",
            name: "San Francisco",
            parentId: 2,
            children: [],
          },
        ],
      },
      {
        id: 7,
        type: "region",
        name: "New York",
        parentId: 1,
        children: [],
      },
    ],
  },
  {
    id: 8,
    type: "country",
    name: "Canada",
    children: [],
  },
  {
    id: 9,
    type: "country",
    name: "United States",
    parentId: null, // Explicitly set parentId to null for top-level
    children: [
      {
        id: 10,
        type: "region",
        name: "California",
        parentId: 9,
        children: [
          {
            id: 11,
            type: "city",
            name: "Los Angeles",
            parentId: 10,
            children: [
              {
                id: 12,
                type: "area",
                name: "Hollywood",
                parentId: 11,
              },
              {
                id: 13,
                type: "area",
                name: "Beverly Hills",
                parentId: 11,
              },
            ],
          },
          {
            id: 14,
            type: "city",
            name: "San Francisco",
            parentId: 10,
            children: [],
          },
        ],
      },
      {
        id: 15,
        type: "region",
        name: "New York",
        parentId: 9,
        children: [],
      },
    ],
  },
];

export default locations;
