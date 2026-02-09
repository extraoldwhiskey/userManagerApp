import api from '../services/api'
import { useState } from 'react';

export default function Toolbar({ selectedIds, onActionDone, users }) {
  const disabled = selectedIds.length === 0
  const selectedUsers = users.filter(u => selectedIds.includes(u.id));
  const canBlock = selectedUsers.some(u => u.status !== 'blocked');
  const canUnblock = selectedUsers.every(u => u.status === 'blocked');
  const ids = selectedUsers.map(u => u.id);
  const versions = selectedUsers.map(u => u.version);
  const [error, setError] = useState(null); 
  
  const action = async (url, method = 'post') => {
    
    try {
      let res
      if (method === 'delete') {
        res = await api.delete(url, { data: { ids, versions } })
      } else {
        res = await api[method](url, { ids, versions })
      }
      if (res.data.redirect) {
        window.location.href = res.data.redirect
        return
      }
      onActionDone()
    } catch (err) {
      if (err.response?.status === 409) {
    setError(err.response.data.message || "Data is outdated. Please refresh.");
  } else {
    setError(err.response?.data?.message || "Unexpected error");
  }
    }
  }

  return (
    <div className="p-sm-3 border-bottom bg-light w-100 overflow-hidden">
    <div className="d-flex gap-2">
      <button
        disabled={!canBlock}
        className="btn btn-outline-primary"
        // disabled={disabled}
        onClick={() => action('/users/block')}
        title="Block"
      >
        <i className="bi bi-lock-fill" />
      </button>

      <button
        disabled={!canUnblock}
        className="btn btn-outline-primary"
        // disabled={disabled}
        onClick={() => action('/users/unblock')}
        title="Unblock"
      >
        <i className="bi bi-unlock" />
      </button>

      <button
        className="btn btn-outline-danger"
        disabled={disabled}
        onClick={() => action('/users', 'delete')}
        title="Delete"
      >
        <i className="bi bi-trash" />
      </button>

      <button
        className="btn btn-outline-danger"
        onClick={() => action('/users/unverified', 'delete')}
        title="Delete unverified"
      >
        <i className="bi bi-person-x" />
      </button>
    </div>
    {error && <div className=" mt-3 alert alert-danger">{error}</div>}
    </div>
  )
}
