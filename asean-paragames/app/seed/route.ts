import pool from '../../db';

export default async function handler(req: any, res: any) {
    try {
        const result = await pool.query('SELECT * FROM tournaments');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching tournaments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

