import type { RouteObject } from "react-router";
import { lazy } from "react";

const CardsListPage = lazy(() => import("./ui/CardsListPage"));
const CardDetailPage = lazy(() => import("./ui/CardDetailPage"));

export const cardsRoutes: RouteObject[] = [
  { path: "cards", element: <CardsListPage /> },
  { path: "cards/:cardId", element: <CardDetailPage /> },
];
export {};
