import { createClient } from '@supabase/supabase-js';

// Define the shape of user records as requested by the user
export interface SupabaseUsuario {
  id: string;
  nome: string;
  email: string;
  data_cadastro: string;
  status_conta: 'Ativa' | 'Bloqueada' | 'Pendente';
}

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Determine if we have real, non-empty, valid credentials
const isRealSupabase = 
  supabaseUrl && 
  supabaseUrl.startsWith('http') && 
  supabaseAnonKey && 
  supabaseAnonKey.length > 20;

export const USING_MOCK_SUPABASE = !isRealSupabase;

// Real Supabase Client (initialized if keys are supplied, otherwise null)
const realClient = isRealSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Mock database helper functions using localStorage
const getMockUsersDB = (): SupabaseUsuario[] => {
  const data = localStorage.getItem('menu_sem_estresse_users_db');
  return data ? JSON.parse(data) : [];
};

const saveMockUsersDB = (db: SupabaseUsuario[]) => {
  localStorage.setItem('menu_sem_estresse_users_db', JSON.stringify(db));
};

const getMockAuthDB = (): Record<string, string> => {
  const data = localStorage.getItem('menu_sem_estresse_auth_db'); // { email: password }
  return data ? JSON.parse(data) : {};
};

const saveMockAuthDB = (db: Record<string, string>) => {
  localStorage.setItem('menu_sem_estresse_auth_db', JSON.stringify(db));
};

// Listeners list for mock Auth state changes
const authListeners: Array<(event: string, session: any) => void> = [];

const triggerAuthStateChange = (event: string, session: any) => {
  authListeners.forEach(listener => {
    try {
      listener(event, session);
    } catch (e) {
      console.error('Error triggering auth listener:', e);
    }
  });
};

// Initial setup of a seed account for instant evaluation (optional, but convenient)
if (USING_MOCK_SUPABASE) {
  const curUsers = getMockUsersDB();
  const curAuth = getMockAuthDB();
  if (curUsers.length === 0) {
    const demoId = 'demo-user-123';
    const demoEmail = 'user@example.com';
    curUsers.push({
      id: demoId,
      nome: 'Gourmet Prático',
      email: demoEmail,
      data_cadastro: new Date().toISOString(),
      status_conta: 'Ativa'
    });
    curAuth[demoEmail] = 'password123';
    saveMockUsersDB(curUsers);
    saveMockAuthDB(curAuth);
  }
}

// Custom High-Fidelity Mock client that mimics the exact @supabase/supabase-js API
const mockClient = {
  auth: {
    async signUp({ email, password, options }: { email: string; password: string; options?: any }) {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate latency
      
      const emailNorm = email.toLowerCase().trim();
      const users = getMockUsersDB();
      const auth = getMockAuthDB();

      if (auth[emailNorm]) {
        return { data: { user: null, session: null }, error: { message: 'Este e-mail já está cadastrado.' } };
      }

      const id = 'user-' + Math.random().toString(36).substring(2, 11);
      const name = options?.data?.name || options?.data?.nome || 'Usuário';

      // Insert into Auth DB
      auth[emailNorm] = password;
      saveMockAuthDB(auth);

      // Insert into Tabela de Usuários (SupabaseUsuario)
      const newUser: SupabaseUsuario = {
        id,
        nome: name,
        email: emailNorm,
        data_cadastro: new Date().toISOString(),
        status_conta: 'Ativa'
      };
      users.push(newUser);
      saveMockUsersDB(users);

      const returnedUser = {
        id,
        email: emailNorm,
        created_at: newUser.data_cadastro,
        user_metadata: { name }
      };

      const session = {
        access_token: 'mock-jwt-token-' + id,
        user: returnedUser,
        expires_at: Math.floor(Date.now() / 1000) + 3600
      };

      // Store in active session
      localStorage.setItem('menu_sem_estresse_session', JSON.stringify(session));
      triggerAuthStateChange('SIGNED_IN', session);

      return { data: { user: returnedUser, session }, error: null };
    },

    async signInWithPassword({ email, password }: { email: string; password: string }) {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate latency

      const emailNorm = email.toLowerCase().trim();
      const auth = getMockAuthDB();
      const users = getMockUsersDB();

      if (!auth[emailNorm] || auth[emailNorm] !== password) {
        return { data: { user: null, session: null }, error: { message: 'E-mail ou senha inválidos.' } };
      }

      const matchingUser = users.find(u => u.email === emailNorm);
      const id = matchingUser?.id || 'user-fallback';
      const name = matchingUser?.nome || 'Usuário';

      const returnedUser = {
        id,
        email: emailNorm,
        created_at: matchingUser?.data_cadastro || new Date().toISOString(),
        user_metadata: { name }
      };

      const session = {
        access_token: 'mock-jwt-token-' + id,
        user: returnedUser,
        expires_at: Math.floor(Date.now() / 1000) + 3600
      };

      // Store active session
      localStorage.setItem('menu_sem_estresse_session', JSON.stringify(session));
      triggerAuthStateChange('SIGNED_IN', session);

      return { data: { user: returnedUser, session }, error: null };
    },

    async signOut() {
      localStorage.removeItem('menu_sem_estresse_session');
      triggerAuthStateChange('SIGNED_OUT', null);
      return { error: null };
    },

    async getSession() {
      const sess = localStorage.getItem('menu_sem_estresse_session');
      return { data: { session: sess ? JSON.parse(sess) : null }, error: null };
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      authListeners.push(callback);
      // Run immediately with current state
      const sess = localStorage.getItem('menu_sem_estresse_session');
      const sessionObj = sess ? JSON.parse(sess) : null;
      callback(sessionObj ? 'SIGNED_IN' : 'SIGNED_OUT', sessionObj);

      return {
        data: {
          subscription: {
            unsubscribe() {
              const idx = authListeners.indexOf(callback);
              if (idx !== -1) authListeners.splice(idx, 1);
            }
          }
        }
      };
    },

    async resetPasswordForEmail(email: string, options?: { redirectTo?: string }) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const emailNorm = email.toLowerCase().trim();
      const auth = getMockAuthDB();
      if (!auth[emailNorm]) {
        return { data: null, error: { message: 'E-mail não cadastrado.' } };
      }
      // Save info that we initiated password reset for this email
      localStorage.setItem('menu_sem_estresse_reset_email', emailNorm);
      return { data: 'Reset link sent!', error: null };
    },

    async updateUser(attributes: { password?: string; data?: { name?: string; nome?: string } }) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const sess = localStorage.getItem('menu_sem_estresse_session');
      if (!sess) return { data: null, error: { message: 'Nenhuma sessão ativa.' } };

      const sessionObj = JSON.parse(sess);
      const email = sessionObj.user.email;
      const users = getMockUsersDB();
      const auth = getMockAuthDB();

      // Update Password
      if (attributes.password) {
        auth[email] = attributes.password;
        saveMockAuthDB(auth);
      }

      // Update Metadata
      const newName = attributes.data?.name || attributes.data?.nome;
      if (newName) {
        sessionObj.user.user_metadata = { 
          ...sessionObj.user.user_metadata,
          name: newName 
        };
        localStorage.setItem('menu_sem_estresse_session', JSON.stringify(sessionObj));

        // Update usuarios table DB
        const uIdx = users.findIndex(u => u.email === email);
        if (uIdx !== -1) {
          users[uIdx].nome = newName;
          saveMockUsersDB(users);
        }
      }

      return { data: { user: sessionObj.user }, error: null };
    }
  },

  // Mock table querying to simulate supabase.from('usuarios')
  from(tableName: string) {
    return {
      select(columns?: string) {
        return {
          async eq(fieldName: string, value: any) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (tableName === 'usuarios') {
              const users = getMockUsersDB();
              const found = users.filter(usr => (usr as any)[fieldName] === value);
              return { data: found, error: null };
            }
            return { data: [], error: null };
          }
        };
      },
      async insert(row: any) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (tableName === 'usuarios') {
          const users = getMockUsersDB();
          // Map snake case or format
          const formatted: SupabaseUsuario = {
            id: row.id,
            nome: row.nome || row.name,
            email: row.email,
            data_cadastro: row.data_cadastro || new Date().toISOString(),
            status_conta: row.status_conta || 'Ativa'
          };
          users.push(formatted);
          saveMockUsersDB(users);
          return { data: [formatted], error: null };
        }
        return { data: [], error: null };
      },
      async update(partialRow: any) {
        return {
          async eq(fieldName: string, value: any) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (tableName === 'usuarios') {
              const users = getMockUsersDB();
              let updatedCount = 0;
              const nextUsers = users.map(u => {
                if ((u as any)[fieldName] === value) {
                  updatedCount++;
                  return {
                    ...u,
                    ...(partialRow.nome && { nome: partialRow.nome }),
                    ...(partialRow.status_conta && { status_conta: partialRow.status_conta })
                  };
                }
                return u;
              });
              saveMockUsersDB(nextUsers);
              return { data: updatedCount, error: null };
            }
            return { data: 0, error: null };
          }
        };
      }
    };
  }
};

// Export active client instance matching standard Supabase layout
export const supabase = USING_MOCK_SUPABASE ? (mockClient as any) : realClient!;
