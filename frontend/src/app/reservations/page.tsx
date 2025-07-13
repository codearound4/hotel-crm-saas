// ---------- front-end: src/app/reservations/page.tsx ----------
"use client";

import { useEffect, useState } from "react";

// Tipagens para dados da API
interface Client {
  id: number;
  full_name: string;
}

interface RoomData {
  id: number;
  number: string;
}

type Option = { value: number; label: string };

interface Reservation {
  id: number;
  client_id: number;
  client_name: string | null;
  room_id: number;
  room_number: string | null;
  check_in: string;
  check_out: string;
  status: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients]         = useState<Option[]>([]);
  const [rooms, setRooms]             = useState<Option[]>([]);
  const [editId, setEditId]           = useState<number | null>(null);
  const [editedRes, setEditedRes]     = useState<Partial<Reservation>>({});
  const [newRes, setNewRes]           = useState<Partial<Reservation>>({ status: "pendente" });
  const [showNew, setShowNew]         = useState(false);

  // Busca clientes e quartos para os selects
  const fetchDeps = async (): Promise<void> => {
    try {
      const [cRes, rRes] = await Promise.all([
        fetch("http://localhost:3001/api/clients"),
        fetch("http://localhost:3001/api/rooms"),
      ]);
      if (!cRes.ok || !rRes.ok) {
        console.error("Erro ao buscar clients ou rooms");
        return;
      }
      const clientsData: Client[] = await cRes.json();
      const roomsData: RoomData[]  = await rRes.json();
      setClients(clientsData.map(c => ({ value: c.id, label: c.full_name })));
      setRooms(roomsData.map(r => ({ value: r.id, label: `Room ${r.number}` })));
    } catch (err) {
      console.error("Erro no fetchDeps:", err);
    }
  };

  // Busca todas as reservas
  const fetchReservations = async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:3001/api/reservations");
      if (!res.ok) {
        console.error("Erro ao buscar reservas");
        return;
      }
      const data: Reservation[] = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Erro no fetchReservations:", err);
    }
  };

  useEffect(() => {
    fetchDeps();
    fetchReservations();
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedRes(prev => ({ ...prev, [name]: value }));
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRes(prev => ({ ...prev, [name]: value }));
  };

  const initEdit = (r: Reservation) => {
    setEditId(r.id);
    setEditedRes({ ...r });
  };

  const saveEdit = async (): Promise<void> => {
    if (editId === null) return;
    const payload = {
      client_id: Number(editedRes.client_id),
      room_id:   Number(editedRes.room_id),
      check_in:  editedRes.check_in,
      check_out: editedRes.check_out,
      status:    editedRes.status,
    };
    console.log("PUT /api/reservations/", editId, payload);
    try {
      const res = await fetch(
        `http://localhost:3001/api/reservations/${editId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      if (!res.ok) throw new Error("Erro ao atualizar reserva");
      setEditId(null);
      fetchReservations();
    } catch (err) {
      console.error("Erro no saveEdit:", err);
      alert("Erro ao atualizar reserva");
    }
  };

  const deleteRes = async (id: number): Promise<void> => {
    if (!confirm("Tem certeza que deseja deletar essa reserva?")) return;
    try {
      const res = await fetch(
        `http://localhost:3001/api/reservations/${id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error("Erro ao deletar reserva");
      fetchReservations();
    } catch (err) {
      console.error("Erro no deleteRes:", err);
      alert("Erro ao deletar reserva");
    }
  };

  const createRes = async (): Promise<void> => {
    const payload = {
      client_id: Number(newRes.client_id),
      room_id:   Number(newRes.room_id),
      check_in:  newRes.check_in,
      check_out: newRes.check_out,
      status:    newRes.status,
    };
    console.log("POST /api/reservations", payload);
    try {
      const res = await fetch(
        "http://localhost:3001/api/reservations",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      if (!res.ok) throw new Error("Erro ao criar reserva");
      setShowNew(false);
      setNewRes({ status: 'pendente' });
      fetchReservations();
    } catch (err) {
      console.error("Erro no createRes:", err);
      alert("Erro ao criar reserva");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservations</h1>
      <button
        onClick={() => setShowNew(prev => !prev)}
        className="mb-4 bg-blue-600 text-white px-3 py-1 rounded"
      >
        {showNew ? 'Cancelar' : 'Nova Reserva'}
      </button>

      {showNew && (
        <div className="mb-4 p-4 border rounded">
          <select name="client_id" onChange={handleNewChange} className="mr-2 ">
            <option>Cliente</option>
            {clients.map(c => (
              <option className = "text-black"key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select name="room_id" onChange={handleNewChange} className="mr-2">
            <option>Quarto</option>
            {rooms.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <input type="date" name="check_in" onChange={handleNewChange} className="mr-2" />
          <input type="date" name="check_out" onChange={handleNewChange} className="mr-2" />
          <select name="status" onChange={handleNewChange} value={newRes.status} className="mr-2">
            <option value="pendente">Pendente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <button onClick={createRes} className="bg-green-600 text-white px-2 rounded">
            Salvar
          </button>
        </div>
      )}

      <ul>
        {reservations.map(r => (
          <li key={r.id} className="mb-2 p-2 border rounded">
            {editId === r.id ? (
              <>
                <select
                  name="client_id"
                  onChange={handleEditChange}
                  value={editedRes.client_id}
                >
                  {clients.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  name="room_id"
                  onChange={handleEditChange}
                  value={editedRes.room_id}
                >
                  {rooms.map(rm => (
                    <option key={rm.value} value={rm.value}>
                      {rm.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  name="check_in"
                  value={editedRes.check_in}
                  onChange={handleEditChange}
                />
                <input
                  type="date"
                  name="check_out"
                  value={editedRes.check_out}
                  onChange={handleEditChange}
                />
                <select
                  name="status"
                  value={editedRes.status}
                  onChange={handleEditChange}
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <button onClick={saveEdit} className="text-green-600 ml-2">💾</button>
                <button onClick={() => setEditId(null)} className="text-gray-600 ml-1">✖️</button>
              </>
            ) : (
              <>
                <span>#{r.id} {r.client_name} → {r.room_number}</span>
                <span className="ml-2">{r.check_in} ↔ {r.check_out}</span>
                <span className="ml-2 font-medium">[{r.status}]</span>
                <button onClick={() => initEdit(r)} className="text-blue-600 ml-2">✏️</button>
                <button onClick={() => deleteRes(r.id)} className="text-red-600 ml-1">🗑</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
