import { useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

export default function UsersTable({ users, currentUser, selectedIds, setSelectedIds, onSort, sortField, sortDirection }) {
  const all = users.length && users.every(u => selectedIds.includes(u.id));
  const ref = useRef();
  useEffect(() => { if(ref.current) ref.current.indeterminate = !all && selectedIds.length > 0 }, [all, selectedIds]);

  const toggleAll = () => setSelectedIds(all ? [] : users.map(u => u.id));
  const toggleOne = id => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="px-2 px-sm-3 w-100 overflow-hidden">
      <table className="table table-sm table-hover w-100 text-break">
        <thead>
          <tr>
            <th><input ref={ref} className="form-check-input" type="checkbox" checked={all} onChange={toggleAll} title="Select all"/></th>
            {["username","email","status","last_login"].map(f=>(
              <th key={f} role="button" onClick={()=>onSort(f)}>
                {f==="username"?"Name":f==="email"?"E-mail":f==="status"?"Status":"Last seen"}{" "}
                {sortField===f?(sortDirection==="asc"?<i className="bi bi-sort-alpha-down"/>:<i className="bi bi-sort-alpha-down-alt"/>):null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(u=>{
            const last = u.last_login && new Date(u.last_login);
            return (
              <tr key={u.id} className={[u.email===currentUser && "table-primary", u.status==="blocked" && "text-muted opacity-50"].filter(Boolean).join(" ")}>
                <td><input type="checkbox" className="form-check-input" checked={selectedIds.includes(u.id)} onChange={()=>toggleOne(u.id)}/></td>
                <td className={u.status==="blocked"?"text-decoration-line-through":""} title={u.status==="blocked"?"Blocked user":""}>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.status}</td>
                <td title={last?.toLocaleString()||""}>{last?formatDistanceToNow(last,{addSuffix:true}):"—"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}