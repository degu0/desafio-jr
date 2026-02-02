export const animalTypeMap = {
  dog: {
    label: 'Cachorro',
    value: 'DOG',
  },
  cat: {
    label: 'Gato',
    value: 'CAT',
  },
} as const;

export function getAnimalLabel(type: string): string {
  const lowerType = type.toLowerCase();
  if (lowerType === 'dog') return 'Cachorro';
  if (lowerType === 'cat') return 'Gato';
  return type;
}

export function formatAnimalTypeFromBackend(type: string): 'dog' | 'cat' {
  if (type === 'DOG') return 'dog';
  if (type === 'CAT') return 'cat';
  return 'dog';
}

export function formatAnimalTypeForBackend(type: string): 'DOG' | 'CAT' {
  if (type === 'dog') return 'DOG';
  if (type === 'cat') return 'CAT';
  return 'DOG';
}