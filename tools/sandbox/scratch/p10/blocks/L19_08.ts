// MSW handler replaying a problematic production payload (anonymized)
import { http, HttpResponse } from 'msw';
import failingPayload from './fixtures/order-INC-2417.json';
export const handlers = [http.get('/api/orders/:id', () => HttpResponse.json(failingPayload))];
