'use client';

import { useEffect, useState } from 'react';

export default function GeneratePokemon() {
  const [pokemon, setPokemon] = useState<string | undefined>();

  async function getPokemon() {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 151)}`,
    );
    const data = await response.json();

    setPokemon(data.name);
  }

  useEffect(() => {
    getPokemon().catch(() => {});
  }, []);

  return <main>This in a {pokemon} page</main>;
}
