export interface Resto {
  _id: string,
  nom: string,
  coord: [number, number],
  adresse: Adresse,
  cuisine: string[]
}

interface Adresse {
  rue: string,
  ville: string,
  cp: number,
  pays: string
}

interface Coord {
  latitude: number,
  longitude: number
}