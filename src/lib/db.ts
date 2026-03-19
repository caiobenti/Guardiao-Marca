// ─── Utilitários de banco de dados ─────────────────────────────────────────
// Evita upsert com onConflict (exige constraint UNIQUE no DB).
// Em vez disso: verifica se existe → update ou insert.

import { supabase } from "./supabase";

/**
 * Salva um registro em qualquer tabela usando check → update/insert.
 * @param table  Nome exato da tabela no Supabase
 * @param matchField  Campo usado como identificador (ex: "user_code")
 * @param matchValue  Valor do identificador
 * @param payload  Dados a salvar
 */
export async function saveRecord(
  table: string,
  matchField: string,
  matchValue: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  // 1. Verifica se já existe um registro
  const { data: existing, error: selectError } = await supabase
    .from(table)
    .select("id")
    .eq(matchField, matchValue)
    .maybeSingle();

  if (selectError) {
    console.error(`[db.saveRecord] Erro ao verificar existência em "${table}":`, selectError.message);
    return { error: selectError.message };
  }

  if (existing) {
    // 2a. Atualiza o registro existente
    const { error: updateError } = await supabase
      .from(table)
      .update({ ...payload, update_at: new Date().toISOString() })
      .eq(matchField, matchValue);

    if (updateError) {
      console.error(`[db.saveRecord] Erro ao atualizar "${table}":`, updateError.message);
      return { error: updateError.message };
    }
  } else {
    // 2b. Cria novo registro
    const { error: insertError } = await supabase
      .from(table)
      .insert({ ...payload, created_at: new Date().toISOString(), update_at: new Date().toISOString() });

    if (insertError) {
      console.error(`[db.saveRecord] Erro ao inserir em "${table}":`, insertError.message);
      return { error: insertError.message };
    }
  }

  return { error: null };
}
