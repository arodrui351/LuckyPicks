import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import '../css/AdminView.css';

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [selected, setSel] = useState(null);
  const [open, setOpen] = useState(false);

  const api = (path) => `http://localhost:8000/api${path}`;

  const fetchJSON = async (url, opts = {}) => {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const load = async () => {
    const data = await fetchJSON(api('/users'));
    setUsers(data);
  };

  const save = async () => {
    await fetchJSON(api(`/users/${selected.id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selected),
    });
    setOpen(false);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  const edit = (u) => {
    setSel({ ...u, password: '', role: u.role ?? 'user' });
  };

  // cuando se actualiza `selected`, abrimos el modal
  useEffect(() => {
    if (selected) {
      setOpen(true);
    }
  }, [selected]);

  return (
    <div className="admin-user-wrapper">
      <Header />
      <div style={{ marginTop: '140px' }}></div>
      <h1 className="admin-user-title">Administrar usuarios</h1>

      <table className="admin-user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Role</th>
            <th>Banned until</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.balance}</td>
              <td>{u.role}</td>
              <td>{u.banned_until ?? '—'}</td>
              <td className="tdButtonsAdminView">
                <button
                  className="verHistorial"
                  style={{ width: '30%', border: '1px solid #cfae58' }}
                  onClick={() => edit(u)}
                >
                  Ver Historial
                </button>
                <button
                  style={{ width: '30%', border: '1px solid #cfae58' }}
                  onClick={() => edit(u)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && selected && (
        <>
          <div
            className="admin-user-modal-overlay"
            onClick={() => setOpen(false)}
          />
          <div className="admin-user-modal">
            <h2>Usuario: {selected.username}</h2>

            <div className="admin-user-modal-field" style={{ width: '100%' }}>
              <p style={{ marginBottom: '4px', marginTop: '4px' }}>
                Cambiar Balance:
              </p>
              <input
                style={{ width: 'calc(100% - 17px)' }}
                id="balance"
                type="number"
                value={selected.balance}
                onChange={(e) =>
                  setSel({ ...selected, balance: +e.target.value })
                }
              />
            </div>
            <div className="admin-user-modal-field">
              <p style={{ marginBottom: '4px', marginTop: '4px' }}>
                Cambiar Rol:
              </p>
              <select
                id="role"
                value={selected.role}
                onChange={(e) =>
                  setSel({ ...selected, role: e.target.value })
                }
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="admin-user-modal-field">
              <p style={{ marginBottom: '4px', marginTop: '4px' }}>
                Cambiar contraseña:
              </p>
              <input
                style={{ width: 'calc(100% - 17px)' }}
                id="password"
                type="password"
                value={selected.password}
                onChange={(e) =>
                  setSel({ ...selected, password: e.target.value })
                }
              />
            </div>
            <div className="admin-user-modal-field">
              <p style={{ marginBottom: '4px', marginTop: '4px' }}>
                Banear hasta:
              </p>
              <input
                style={{ width: 'calc(100% - 17px)' }}
                id="bannedUntil"
                type="datetime-local"
                value={selected.banned_until?.slice(0, 16) || ''}
                onChange={(e) =>
                  setSel({
                    ...selected,
                    banned_until: e.target.value || null,
                  })
                }
              />
            </div>
            <div className="admin-user-modal-actions">
              <button className="cancel" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className='save' onClick={save}>Save</button>
              
            </div>
          </div>
        </>
      )}
    </div>
  );
}
