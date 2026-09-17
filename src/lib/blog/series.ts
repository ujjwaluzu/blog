export type Series = {
  name: string;
  description: string;
  image: string;
};

// Build logs are editorial navigation until the database has a series model.
export const series: Series[] = [
  {
    name: "REPOTEAM",
    description: "From idea → architecture → development → production",
    image: "/images/placeholder-1.png",
  },
  {
    name: "UZZUTV",
    description: "Building and deploying a personal streaming platform",
    image: "/images/placeholder-4.png",
  },
  {
    name: "UJJWALUZU",
    description: "Designing and building my personal web presence",
    image: "/images/placeholder-2.png",
  },
];
