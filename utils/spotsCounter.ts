const DB_ENDPOINT = process.env.EXPO_PUBLIC_RORK_DB_ENDPOINT;
const DB_TOKEN = process.env.EXPO_PUBLIC_RORK_DB_TOKEN;
const DB_NAMESPACE = process.env.EXPO_PUBLIC_RORK_DB_NAMESPACE;

const TOTAL_SPOTS = 50;
const COUNTER_ID = 'spots_counter:main';

async function dbQuery(sql: string): Promise<any> {
  if (!DB_ENDPOINT || !DB_TOKEN || !DB_NAMESPACE) {
    console.log('[SpotsCounter] Missing DB env vars, skipping query');
    return null;
  }

  console.log('[SpotsCounter] Executing query:', sql);

  const res = await fetch(`${DB_ENDPOINT}/sql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DB_TOKEN}`,
      'surreal-ns': DB_NAMESPACE!,
      'surreal-db': DB_NAMESPACE!,
      'Accept': 'application/json',
      'Content-Type': 'text/plain',
    },
    body: sql,
  });

  if (!res.ok) {
    const text = await res.text();
    console.log('[SpotsCounter] DB error:', res.status, text);
    throw new Error(`DB query failed: ${res.status}`);
  }

  const data = await res.json();
  console.log('[SpotsCounter] DB response:', JSON.stringify(data));
  return data;
}

export async function getSpotsRemaining(): Promise<number> {
  try {
    const result = await dbQuery(`SELECT * FROM ${COUNTER_ID}`);

    if (result?.[0]?.result?.[0]?.claimed != null) {
      const claimed = result[0].result[0].claimed as number;
      console.log('[SpotsCounter] Claimed count:', claimed);
      return Math.max(0, TOTAL_SPOTS - claimed);
    }

    console.log('[SpotsCounter] No counter record found, initializing');
    await dbQuery(`CREATE ${COUNTER_ID} SET claimed = 0, updated_at = time::now()`);
    return TOTAL_SPOTS;
  } catch (err) {
    console.log('[SpotsCounter] getSpotsRemaining error:', err);
    return TOTAL_SPOTS;
  }
}

export async function claimSpot(): Promise<{ spotsRemaining: number; success: boolean }> {
  try {
    const remaining = await getSpotsRemaining();

    if (remaining <= 0) {
      console.log('[SpotsCounter] No spots remaining');
      return { spotsRemaining: 0, success: false };
    }

    const result = await dbQuery(`UPDATE ${COUNTER_ID} SET claimed += 1, updated_at = time::now()`);

    if (result?.[0]?.result?.[0]?.claimed != null) {
      const newClaimed = result[0].result[0].claimed as number;
      const newRemaining = Math.max(0, TOTAL_SPOTS - newClaimed);
      console.log('[SpotsCounter] Spot claimed. Remaining:', newRemaining);
      return { spotsRemaining: newRemaining, success: true };
    }

    return { spotsRemaining: Math.max(0, remaining - 1), success: true };
  } catch (err) {
    console.log('[SpotsCounter] claimSpot error:', err);
    return { spotsRemaining: TOTAL_SPOTS - 1, success: true };
  }
}

export const TOTAL_BETA_SPOTS = TOTAL_SPOTS;
