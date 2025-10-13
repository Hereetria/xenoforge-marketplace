/**
 * Stripe Test Card Data for Demo
 */

export interface TestCard {
  id: string;
  name: string;
  number: string;
  expiry: string;
  cvc: string;
  description: string;
  status: 'success' | 'declined' | '3d-secure';
}

export const TEST_CARDS: TestCard[] = [
  {
    id: 'visa-success',
    name: 'Visa Success',
    number: '4242 4242 4242 4242',
    expiry: '12/34',
    cvc: '123',
    description: 'Visa card - always succeeds',
    status: 'success'
  },
  {
    id: 'mastercard-success',
    name: 'Mastercard Success',
    number: '5555 5555 5555 4444',
    expiry: '12/34',
    cvc: '123',
    description: 'Mastercard - always succeeds',
    status: 'success'
  },
  {
    id: 'amex-success',
    name: 'American Express Success',
    number: '3782 822463 10005',
    expiry: '12/34',
    cvc: '1234',
    description: 'American Express - always succeeds',
    status: 'success'
  },
  {
    id: '3d-secure',
    name: '3D Secure Card',
    number: '4000 0025 0000 3155',
    expiry: '12/34',
    cvc: '123',
    description: 'Requires 3D Secure',
    status: '3d-secure'
  },
  {
    id: 'declined',
    name: 'Declined Card',
    number: '4000 0000 0000 0002',
    expiry: '12/34',
    cvc: '123',
    description: 'Always declined',
    status: 'declined'
  },
  {
    id: 'insufficient-funds',
    name: 'Insufficient Funds',
    number: '4000 0000 0000 9995',
    expiry: '12/34',
    cvc: '123',
    description: 'Insufficient funds',
    status: 'declined'
  }
];

export const getTestCardById = (id: string): TestCard | undefined => {
  return TEST_CARDS.find(card => card.id === id);
};

export const getSuccessCard = (): TestCard => {
  return TEST_CARDS.find(card => card.id === 'visa-success')!;
};
