'use server';

import { handler } from '@/app/api/auth/[...nextauth]/route';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await handler.signIn('patreon');
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'OAuthCallbackError':
          return 'OAuth encountered an error.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function signOut() {
  try {
    console.log('SIGN OUT')
    if (await cookies().has('user')) {
      console.log('DELETING USER COOKIE')
      await cookies().delete('user')
      console.log(`HAS USER VALUE: ${!!cookies().get('user')?.value}\n------------------------------`)
    }
  } catch (error) {
    console.log(`COULD NOT SIGN OUT: ${error}`)
  }
  revalidatePath('/login')
  redirect('/login')
}