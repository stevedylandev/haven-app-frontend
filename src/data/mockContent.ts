export const mockContent = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
    type: 'image'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8',
    type: 'image'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1434596922112-19c563067271',
    type: 'image'
  },
] as const;

export const actionChoices = [
  { id: '1', label: 'Running' },
  { id: '2', label: 'Walking' },
  { id: '3', label: 'Dancing' },
  { id: '4', label: 'Jumping' },
  { id: '5', label: 'Swimming' },
] as const;