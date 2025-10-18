// /pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
// NextAuth(Naver) 쓰는 경우만 주석 해제
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from './auth/[...nextauth]';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// Supabase 액세스 토큰 또는 NextAuth 세션 기반으로 user_id 해석
async function resolveUserId(req: NextApiRequest): Promise<string | null> {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token) {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (!error && data?.user?.id) return data.user.id;
    }

    // NextAuth를 쓰면 아래 주석 해제해서 이메일→users.id 매핑
    // try {
    //   const session = await getServerSession(req, {} as any, authOptions);
    //   const email = session?.user?.email;
    //   if (email) {
    //     const { data: u } = await supabaseAdmin
    //       .from('users')
    //       .select('id')
    //       .eq('email', email)
    //       .maybeSingle();
    //     if (u?.id) return u.id;
    //   }
    // } catch {}

    // 개발용 최후 수단: body.user_id 허용
    const bodyUserId = req.body?.user_id;
    if (typeof bodyUserId === 'string' && /^[0-9a-fA-F-]{36}$/.test(bodyUserId)) {
        return bodyUserId;
    }
    return null;
}

function parsePayload(body: any) {
    const content = (body?.content ?? body?.message ?? '').toString().trim();
    const song_title =
        body?.song_title !== undefined ? String(body.song_title) : null;
    const feedback_title =
        body?.feedback_title !== undefined ? String(body.feedback_title) : null;
    const reason = body?.reason !== undefined ? String(body.reason) : null;
    return { content, song_title, feedback_title, reason };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const userId = await resolveUserId(req);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: cannot resolve user' });
        }

        const { content, song_title, feedback_title, reason } = parsePayload(req.body || {});
        if (!content) {
            return res.status(400).json({ error: "Missing 'content' (or 'message')" });
        }

        const { error } = await supabaseAdmin.from('feedback').insert([
            { user_id: userId, content, song_title, feedback_title, reason }
        ]);
        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ ok: true });
    } catch (e: any) {
        return res.status(500).json({ error: e?.message ?? 'Internal Server Error' });
    }
}
