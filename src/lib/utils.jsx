import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getRarityStyle(rarity) {
  switch(rarity) {
    case 'common':
      return 'bg-blue-500';
    case 'rare':
      return 'bg-purple-500';
    case 'epic':
      return 'bg-yellow-500';
    case 'legendary':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
}
