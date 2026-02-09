import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import UsersTable from "../components/UsersTable";
import Toolbar from "../components/Toolbar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCurrentUser(res.data))
      .catch(() => {
      localStorage.removeItem('token');
      window.location.href = '/login?msg=Session expired';
    });

    loadUsers()
  }, [])

  const loadUsers = async () => {
    const res = await api.get("http://localhost:3000/users");
    setUsers(res.data);
    setSelectedIds([]);
  };

  function handleSort(field) {
  const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc"
  setSortField(field)
  setSortDirection(direction)

  setUsers(prev => [...prev].sort((a, b) => {
    const x = a[field], y = b[field]
    if (x == null) return 1
    if (y == null) return -1

    const dx = new Date(x), dy = new Date(y)
    return !isNaN(dx) && !isNaN(dy)
      ? direction === "asc" ? dx - dy : dy - dx
      : !isNaN(x) && !isNaN(y)
        ? direction === "asc" ? x - y : y - x
        : direction === "asc"
          ? String(x).toLowerCase().localeCompare(String(y).toLowerCase())
          : String(y).toLowerCase().localeCompare(String(x).toLowerCase())
  }))
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
     <div className="min-vh-100 vw-100 d-flex flex-column justify-content-center">
      <header className="bg-dark">
      <div className="container-lg px-3">
       <Header user={currentUser}/>
      </div>
      </header>
    
    <main className="flex-grow-1">
      <div className="container-lg px-3">
        <div className="mb-3">
          <Toolbar selectedIds={selectedIds} onActionDone={loadUsers} users={users} />
        </div>
        
        <div className="">
          <UsersTable
            users={users}
            currentUser={currentUser?.email}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </main>
  </div>
  );
}
