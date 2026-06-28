const categoryFolderMap = {
  Stickers: "shop",
};

const productAsset = (category, filename) => {
  const categoryFolder =
    categoryFolderMap[category] ?? category.toLowerCase().replace(/\s+/g, "-");
  return encodeURI(`/products/${categoryFolder}/${filename}`);
};

const titleCaseWord = (word) =>
  word
    .split("-")
    .map((part) => (part ? `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}` : part))
    .join("-");

const toTitleCase = (value) =>
  value
    .split(" ")
    .map((word) => titleCaseWord(word))
    .join(" ");

const filenameToTitle = (filename) =>
  toTitleCase(
    filename
      .replace(/\.[^/.]+$/, "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

const thumbFilename = (filename) => `${filename.replace(/\.[^/.]+$/, "")}.webp`;

const defaultDrawingDetails = ["Pen on Paper", "21cm x 30cm"];
const stickerDetails = ["Printed sticker", "Dimensions to be confirmed"];

const drawingDetailOverrides = {
  "F-Word.png": ["Acrylic on Paper", "21cm x 30cm"],
  "Get Out of My Head.jpg": ["Marker and Pen on Paper", "21cm x 30cm"],
  "Venice Beach.jpg": ["Pencil and Pen on Paper", "42cm x 30cm"],
};

const drawingFiles = [
  "Alarm clock.png",
  "BAT.png",
  "Bathroom glass.png",
  "Bathroom searching.png",
  "billboard.png",
  "Birds Eye_.png",
  "bomb.png",
  "Bursting through the billboard.png",
  "Can anyone hear me.png",
  "Cat nabbed.png",
  "centipede.png",
  "Charlie interaction.png",
  "Charlie slap.png",
  "Charlie the ri.png",
  "Chicken fight.png",
  "Choo_Choo.png",
  "Chores with Charlie.png",
  "Chores with Charlie_.png",
  "Destiny.jpg",
  "Drawing of my car.png",
  "driving.png",
  "Exit wound.png",
  "Flesh light.png",
  "Flowin Cafe.png",
  "Foot sex.png",
  "French horn.png",
  "Front Door.png",
  "F-Word.png",
  "Get Out of My Head.jpg",
  "girl.png",
  "gorilla.png",
  "hands.png",
  "Help me.png",
  "house.png",
  "in sync.png",
  "In the car with Charlie swim.png",
  "In the car.png",
  "Jack.png",
  "Jesus truck.png",
  "King Kong_.png",
  "Korean fried chicken.png",
  "Me smoking_1.png",
  "Nesting dolls.png",
  "Ooh yea.png",
  "pac.png",
  "Pen plaza 2.png",
  "Pen plaza.png",
  "Peter tosh.png",
  "Pick ups lines.png",
  "Places and faces.png",
  "Rocket dog.png",
  "Rolling tray.png",
  "Run dmc.png",
  "sample.png",
  "Say no to nazis.png",
  "scenic.png",
  "Self portrait.png",
  "Shotgun_.png",
  "skiddish.png",
  "smart and final.png",
  "SWIM.png",
  "Terry Death.png",
  "The border.png",
  "The end of swim.png",
  "Through the window.png",
  "Venice Beach.jpg",
  "Wall poster.png",
  "women.png",
];

const drawingProducts = drawingFiles.map((filename, index) => ({
  id: 14 + index,
  code: `DR-${String(index + 1).padStart(2, "0")}`,
  title: filenameToTitle(filename),
  category: "Drawings",
  price: 180,
  image: productAsset("Drawings", `full/${thumbFilename(filename)}`),
  thumbnail: productAsset("Drawings", `thumbs/${thumbFilename(filename)}`),
  details: drawingDetailOverrides[filename] ?? defaultDrawingDetails,
  description: (drawingDetailOverrides[filename] ?? defaultDrawingDetails).join(". "),
}));

export const products = [
  {
    id: 1,
    code: "ST-01",
    title: "Sugar Hill Mandra",
    category: "Stickers",
    price: 8,
    image: productAsset("Stickers", "Sugar Hill Mandra.webp"),
    thumbnail: productAsset("Stickers", "thumbs/Sugar Hill Mandra.webp"),
    details: stickerDetails,
    description: stickerDetails.join(". "),
  },
  {
    id: 2,
    code: "ST-02",
    title: "Blonde",
    category: "Stickers",
    price: 14,
    image: productAsset("Stickers", "Blonde.webp"),
    thumbnail: productAsset("Stickers", "thumbs/Blonde.webp"),
    details: stickerDetails,
    description: stickerDetails.join(". "),
  },
  {
    id: 3,
    code: "PT-01",
    title: "February First",
    category: "Paintings",
    price: 320,
    image: productAsset("Paintings", "February First.webp"),
    thumbnail: productAsset("Paintings", "thumbs/February First.webp"),
    details: ["Acrylic on Canvas", "30cm x 40cm"],
    description: "Acrylic on Canvas. 30cm x 40cm.",
  },
  {
    id: 4,
    code: "PT-02",
    title: "Kwain The Unthinkable",
    category: "Paintings",
    price: 540,
    image: productAsset("Paintings", "Kwain The Unthinkable.webp"),
    thumbnail: productAsset("Paintings", "thumbs/Kwain The Unthinkable.webp"),
    details: ["Acrylic on Canvas", "30cm x 40cm"],
    description: "Acrylic on Canvas. 30cm x 40cm.",
  },
  {
    id: 5,
    code: "FR-01",
    title: "Dance",
    category: "Furniture",
    price: 580,
    image: productAsset("Furniture", "dance.gif"),
    thumbnail: productAsset("Furniture", "dance-thumb.webp"),
    media: [
      {
        src: productAsset("Furniture", "dance.gif"),
        label: "Animated preview",
      },
      {
        src: productAsset("Furniture", "Dresser As A Whole.webp"),
        thumbnail: productAsset("Furniture", "thumbs/Dresser As A Whole.webp"),
        label: "As a whole",
      },
      {
        src: productAsset("Furniture", "Dresser Perfect 2.webp"),
        thumbnail: productAsset("Furniture", "thumbs/Dresser Perfect 2.webp"),
        label: "Perfect 2",
      },
      {
        src: productAsset("Furniture", "Dresser Perfect.webp"),
        thumbnail: productAsset("Furniture", "thumbs/Dresser Perfect.webp"),
        label: "Perfect",
      },
      {
        src: productAsset("Furniture", "Dresser Front.webp"),
        thumbnail: productAsset("Furniture", "thumbs/Dresser Front.webp"),
        label: "Front of dresser",
      },
      {
        src: productAsset("Furniture", "Dresser Front Left Side.webp"),
        thumbnail: productAsset("Furniture", "thumbs/Dresser Front Left Side.webp"),
        label: "Dresser front left side",
      },
      {
        src: productAsset("Furniture", "Dresser Front Right Side.webp"),
        thumbnail: productAsset("Furniture", "thumbs/Dresser Front Right Side.webp"),
        label: "Dresser front right side",
      },
      {
        src: productAsset("Furniture", "Dresser Side.webp"),
        thumbnail: productAsset("Furniture", "thumbs/Dresser Side.webp"),
        label: "Side of the dresser",
      },
      {
        src: productAsset("Furniture", "Dresser Side Final.webp"),
        thumbnail: productAsset("Furniture", "thumbs/Dresser Side Final.webp"),
        label: "SIDE OF THE DRESSER FINAL",
      },
    ],
    details: ["Pen, pencil and marker on wood", "83cm wide x 42cm deep x 78cm tall"],
    description: "Pen, pencil and marker on wood. 83cm wide x 42cm deep x 78cm tall.",
  },
  {
    id: 7,
    code: "ST-03",
    title: "Charlie",
    category: "Stickers",
    price: 6,
    image: productAsset("Stickers", "Charlie.webp"),
    thumbnail: productAsset("Stickers", "thumbs/Charlie.webp"),
    details: stickerDetails,
    description: stickerDetails.join(". "),
  },
  {
    id: 9,
    code: "ST-04",
    title: "Guerilla",
    category: "Stickers",
    price: 6,
    image: productAsset("Stickers", "Guerilla.webp"),
    thumbnail: productAsset("Stickers", "thumbs/Guerilla.webp"),
    details: stickerDetails,
    description: stickerDetails.join(". "),
  },
  {
    id: 10,
    code: "ST-05",
    title: "Help Me",
    category: "Stickers",
    price: 6,
    image: productAsset("Stickers", "Help me.webp"),
    thumbnail: productAsset("Stickers", "thumbs/Help me.webp"),
    details: stickerDetails,
    description: stickerDetails.join(". "),
  },
  {
    id: 11,
    code: "ST-06",
    title: "Pow!",
    category: "Stickers",
    price: 6,
    image: productAsset("Stickers", "POW!.webp"),
    thumbnail: productAsset("Stickers", "thumbs/POW!.webp"),
    details: stickerDetails,
    description: stickerDetails.join(". "),
  },
  {
    id: 6,
    code: "PT-06",
    title: "The Tourist",
    category: "Paintings",
    price: 460,
    image: productAsset("Paintings", "The Tourist.webp"),
    thumbnail: productAsset("Paintings", "thumbs/The Tourist.webp"),
    details: ["Oil, Acrylic on canvas", "160cm x 36cm"],
    description: "Oil, Acrylic on canvas. 160cm x 36cm.",
  },
  {
    id: 103,
    code: "PT-10",
    title: "The Berliner",
    category: "Paintings",
    price: 460,
    image: productAsset("Paintings", "The Berliner.webp"),
    thumbnail: productAsset("Paintings", "thumbs/The Berliner.webp"),
    details: ["Oil, Acrylic on canvas", "160cm x 36cm"],
    description: "Oil, Acrylic on canvas. 160cm x 36cm.",
  },
  {
    id: 104,
    code: "PT-11",
    title: "The Geisha",
    category: "Paintings",
    price: 460,
    image: productAsset("Paintings", "The Geisha.webp"),
    thumbnail: productAsset("Paintings", "thumbs/The Geisha.webp"),
    details: ["Oil, Acrylic on canvas", "160cm x 36cm"],
    description: "Oil, Acrylic on canvas. 160cm x 36cm.",
  },
  {
    id: 100,
    code: "PT-07",
    title: "Happy Birthday",
    category: "Paintings",
    price: 460,
    image: productAsset("Paintings", "Happy Birthday.webp"),
    thumbnail: productAsset("Paintings", "thumbs/Happy Birthday.webp"),
    details: ["Oil, Acrylic, Crayon, Pen on Canvas", "240cm x 100cm"],
    description: "Oil, Acrylic, Crayon, Pen on Canvas. 240cm x 100cm.",
  },
  {
    id: 101,
    code: "PT-08",
    title: "Baby Drag",
    category: "Paintings",
    price: 460,
    image: productAsset("Paintings", "Baby Drag.webp"),
    thumbnail: productAsset("Paintings", "thumbs/Baby Drag.webp"),
    details: ["Acrylic", "70cm x 100cm"],
    description: "Acrylic. 70cm x 100cm.",
  },
  {
    id: 102,
    code: "PT-09",
    title: "Mach 1",
    category: "Paintings",
    price: 460,
    image: productAsset("Paintings", "MACH 1.webp"),
    thumbnail: productAsset("Paintings", "thumbs/MACH 1.webp"),
    details: ["Acrylic and Spray Paint", "140cm x 240cm"],
    description: "Acrylic and Spray Paint. 140cm x 240cm.",
  },
  ...drawingProducts,
];
