import 'server-only';

import { cookies} from 'next/headers';
import { decrypt } from './session';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export const verifySession = cache(async () => {
    const cookie = ((await cookies()).get('session')?.value);
    const session = await decrypt(cookie);

    if (!session?.athleteId) {
        throw new Error('Unauthorized');
        redirect('/login');
    }
    return {isAuthenticated: true, userId: session.athleteId, role: session.role};
})
