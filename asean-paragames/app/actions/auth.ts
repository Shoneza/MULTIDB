'use server';
import { SignupFormSchema, FormState } from "../lib/definitions";
import { createSession, deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import { success } from "zod";
import pool from "../../db";
import { db } from "@/app/lib/db/client";
import { athletes } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
export async function login(state:FormState,formData: FormData) {

    const validateFields = SignupFormSchema.pick({ email: true, password: true }).safeParse({
        email: formData.get('email'),
        password: formData.get('password'), 
    })
    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
        }
    }
    const {  email, password } = validateFields.data;
    try {
        // const res = await pool.query('SELECT athlete_id, username FROM athletes WHERE email = $1', [email]);
        const res = await db.select({athleteId: athletes.athleteId, userName: athletes.username, password: athletes.password}).from(athletes).where(eq(athletes.email, email));
        if (res.length === 0) {
            return {
                message: 'Incorrect email or password.',
            }
        }
        const user = res[0];
        // In a real application, you should verify the password here using hashing
        if (password !== user.password) {
            return {
                message: 'Incorrect email or password.',
            }
        }
        const roleRes = await fetch(`${baseUrl}/api/roles?athleteId=${user.athleteId}`);
        const roleData = await roleRes.json();
        if (roleRes.ok) {
            console.log('User role:', roleData.role);
        } else {
            console.error('Failed to fetch user role:', roleData.error);
        }

        await createSession(user.userName, user.athleteId, roleData.role);
        if (roleData.role === 'athlete') {
            redirect(`${baseUrl}/athlete`);
        }
        else {
            redirect(`${baseUrl}/admin/competitions`);
        }


    } catch (error) {
        // Re-throw redirect errors
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Login error:', error);
        return {
            message: 'An error occurred during login. Please try again.',
        }
    }
}

export async function logout() {
    await deleteSession();
    redirect('/login');

}
export async function register(state: FormState, formData: FormData) {
    console.log('Registering user with data:', {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
  
  const confirm = formData.get('confirmPassword');
  if (typeof confirm !== 'string' || !confirm.trim()) {
    return {
        errors: {
            confirmPassword: ['Confirm password is required.']
        }
    }}
    if (validatedFields.success && validatedFields.data.password !== confirm) {
        return {
            errors: {
                confirmPassword: ['Passwords do not match.']
            }
        }
    }
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
        errors: validatedFields.error.flatten().fieldErrors,
    }
    }
    const { username, email, password } = validatedFields.data;
    const res = await fetch(`${baseUrl}/api/athletes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'register', username: username, email: email, password: password }),
    });

    console.log(res)
    const result = await res.json();
    if (!res.ok) {
        console.error('Registration failed:', result.error);
        return {
            message: result.error || 'Registration failed. Please try again.',
        }
    }
        const addRole = await fetch(`${baseUrl}/api/roles`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify({
            
        })});
    await createSession(result.userName,result.athleteId,'athlete');

    redirect('/athlete-form');

}