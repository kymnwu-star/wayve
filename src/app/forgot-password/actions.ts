'use server'

import { supabase } from '@/utils/supabase'

export async function checkEmailAndSendCode(email: string) {
  try {
    let foundTableName = '';

    const checkTable = async (tableName: string) => {
      const { data } = await supabase
        .from(tableName)
        .select('email')
        .eq('email', email);
      
      if (data && data.length > 0) {
        foundTableName = tableName;
      }
    };

    // 가입자 테이블 순차 검색
    await checkTable('tourists');
    if (!foundTableName) await checkTable('partners');
    if (!foundTableName) await checkTable('admins');

    if (foundTableName) {
      // (프로토타입) 실제 이메일을 쏘는 대신 프론트엔드에서 모의 코드를 띄우기 위해 success만 반환
      return { success: true, tableName: foundTableName };
    } else {
      return { success: false, error: '가입되지 않은 이메일입니다.' };
    }
  } catch (error) {
    console.error('Supabase API Error (Check Email):', error);
    return { success: false, error: '백엔드 시스템 오류가 발생했습니다.' };
  }
}

export async function updatePassword(email: string, newPassword: string, tableName: string) {
  try {
    const { error } = await supabase
      .from(tableName)
      .update({ password: newPassword })
      .eq('email', email);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Supabase API Error (Update Password):', error);
    return { success: false, error: '비밀번호 재설정 중 오류가 발생했습니다.' };
  }
}
