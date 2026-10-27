import type { ChangeEvent, FormEvent, MouseEvent } from "react";
export function h1(e: ChangeEvent<HTMLInputElement>) { return e.target.value; }
export function h2(e: ChangeEvent<HTMLInputElement>) { return e.currentTarget.value; }
export function h3(e: FormEvent<HTMLFormElement>) { return e.target.value; }
export function h4(e: MouseEvent<HTMLButtonElement>) { return e.target.value; }
