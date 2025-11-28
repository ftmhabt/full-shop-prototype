'use server';
import { cookies } from 'next/headers';

type Theme = 'light' | 'dark' | 'system';

export async function setThemeCookie(theme: Theme) {
  const cookieStore = await cookies();
  cookieStore.set('theme', theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getThemeCookie(): Promise<Theme | null> {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');
  return theme?.value as Theme | null;
}