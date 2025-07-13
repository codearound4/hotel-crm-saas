"use client";

import { useEffect, useState } from "react";

type Room = {
  id: number;
  number: string;
  type: string;
  description: string | null;
  price_per_night: number | string;
  client_name: string | null;
  is_available: boolean | number;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editedRoom, setEditedRoom] = useState<Partial<Room>>({});
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: "",
    type: "single",
    description: "",
    price_per_night: "",
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/rooms/status");
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error("Erro ao buscar quartos:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (room: Room) => {
    setEditId(Number(room.id));
    setEditedRoom({
      number: room.number,
      type: room.type,
      description: room.description ?? null,
      price_per_night: room.price_per_night,
      is_available: room.is_available ? 1 : 0,
    });
  };

  const handleSave = async () => {
    if (editId === null) {
      console.warn("handleSave chamado com editId nulo");
      return;
    }

    // Monta payload com tipos corretos
    const payload = {
      number: String(editedRoom.number ?? ""),
      type: String(editedRoom.type ?? "single"),
      description: editedRoom.description ?? null,
      price_per_night: Number(editedRoom.price_per_night) || 0,
      is_available: Number(editedRoom.is_available) === 1 ? 1 : 0,
    };

    const url = `http://localhost:3001/api/rooms/${editId}`;
    console.log("handleSave chamado — editId:", editId);
    console.log("Fazendo PUT em:", url, "com payload:", payload);

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      console.log("Resposta do servidor:", responseText);
      if (!res.ok) {
        console.error("Status code:", res.status);
        throw new Error("Erro ao atualizar quarto");
      }

      await fetchRooms();
      setEditId(null);
    } catch (err) {
      console.error("Erro no handleSave:", err);
      alert("Erro ao salvar");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este quarto?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/rooms/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar quarto");
      await fetchRooms();
    } catch (err) {
      console.error("Erro no handleDelete:", err);
      alert("Erro ao deletar");
    }
  };

  const handleCreate = async () => {
    const payload = {
      number: String(newRoom.number ?? ""),
      type: String(newRoom.type ?? "single"),
      description: newRoom.description ?? null,
      price_per_night: Number(newRoom.price_per_night) || 0,
      is_available: 1,
    };
    console.log("Criando quarto com payload:", payload);

    try {
      const res = await fetch("http://localhost:3001/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao criar quarto");
      await fetchRooms();
      setNewRoom({ number: "", type: "single", description: "", price_per_night: "" });
      setShowNewForm(false);
    } catch (err) {
      console.error("Erro no handleCreate:", err);
      alert("Erro ao criar quarto");
    }
  };

  return (
    <div className="mt-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-white-800">Rooms</h1>

      <button
        onClick={() => setShowNewForm((prev) => !prev)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showNewForm ? "⬆️ Ocultar Formulário" : "➕ Novo Quarto"}
      </button>

      {showNewForm && (
        <div className="bg-grey-500 border rounded-lg p-4 shadow mb-8 max-w-xl">
          <h2 className="text-xl font-semibold mb-2">Novo Quarto</h2>
          <div className="grid grid-cols-2 gap-2">
            <input
              name="number"
              value={newRoom.number || ""}
              onChange={handleNewChange}
              placeholder="Número"
              className="border rounded px-2 py-1"
            />
            <select
              name="type"
              value={newRoom.type || "single"}
              onChange={handleNewChange}
              className="border rounded px-2 py-1"
            >
              <option className="text-black" value="single">
                Single
              </option>
              <option className="text-black" value="double">
                Double
              </option>
              <option className="text-black" value="suite">
                Suite
              </option>
            </select>
            <input
              name="description"
              value={newRoom.description || ""}
              onChange={handleNewChange}
              placeholder="Descrição"
              className="col-span-2 border rounded px-2 py-1"
            />
            <input
              name="price_per_night"
              value={newRoom.price_per_night || ""}
              onChange={handleNewChange}
              placeholder="Preço por noite"
              className="col-span-2 border rounded px-2 py-1"
            />
          </div>
          <button
            onClick={handleCreate}
            className="mt-3 bg-gray-800 cursor-pointer text-white px-4 py-1 rounded hover:bg-gray-500"
          >
            ➕ Adicionar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">
              {editId === room.id ? (
                <input
                  name="number"
                  value={editedRoom.number || ""}
                  onChange={handleEditChange}
                  className="border p-1 rounded"
                />
              ) : (
                `Room ${room.number}`
              )}
            </h2>

            <p className="text-gray-600 capitalize">
              {editId === room.id ? (
                <select
                  name="type"
                  value={editedRoom.type || ""}
                  onChange={handleEditChange}
                  className="border p-1 rounded"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="suite">Suite</option>
                </select>
              ) : (
                `Type: ${room.type}`
              )}
            </p>

            {editId === room.id ? (
              <input
                name="description"
                value={editedRoom.description || ""}
                onChange={handleEditChange}
                className="w-full border p-1 mt-1 rounded"
              />
            ) : (
              room.description && (
                <p className="text-gray-500 text-sm italic mb-1">
                  {room.description}
                </p>
              )
            )}

            <p className="text-gray-600">
              €{" "}
              {room.price_per_night !== null && !isNaN(Number(room.price_per_night))
                ? Number(room.price_per_night).toFixed(2)
                : "N/A"}{" "}
              / night
            </p>

            <p
              className={`mt-2 font-medium ${
                room.client_name
                  ? "text-red-600"
                  : Number(room.is_available) === 1
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {room.client_name
                ? `Ocupado por ${room.client_name}`
                : Number(room.is_available) === 1
                ? "Disponível"
                : "Indisponível"}
            </p>

            {editId === room.id && (
              <label className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={editedRoom.is_available === 1}
                  onChange={(e) =>
                    setEditedRoom((prev) => ({
                      ...prev,
                      is_available: e.target.checked ? 1 : 0,
                    }))
                  }
                />
                Marcar como disponível
              </label>
            )}

            <div className="mt-2 space-x-2">
              {editId === room.id ? (
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  💾 Salvar
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(room)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  ✏️ Editar
                </button>
              )}
              <button
                onClick={() => handleDelete(room.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                🗑 Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}