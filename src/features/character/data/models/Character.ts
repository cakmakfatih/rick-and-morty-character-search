interface Character {
  id: string;
  name: string;
  image: string;
  episode: {
    id: string;
  }[];
}

export default Character;
