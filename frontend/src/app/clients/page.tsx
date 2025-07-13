"use client"

import { useEffect, useState } from "react"

type Client = {
  id: number
  full_name: string
  email: string
  document: string
  birth_date: string
  profession: string
  address: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [editedClient, setEditedClient] = useState<Partial<Client>>({})

  useEffect(() => {
    fetch("http://localhost:3001/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Erro ao buscar clientes:", err))
  }, [])

  const handleEdit = (client: Client) => {
    setEditId(client.id)
    setEditedClient(client)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedClient((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/clients/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedClient),
      })

      if (!res.ok) throw new Error("Erro ao atualizar cliente")

      // Atualizar localmente
      setClients((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...editedClient } : c))
      )
      setEditId(null)
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar")
    }
  }

const handleDelete = async (id: number) => {
  const confirm = window.confirm("Are you sure you want to delete this client?");
  if (!confirm) return;

  try {
    const res = await fetch(`http://localhost:3001/api/clients/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete client");

    setClients((prev) => prev.filter((c) => c.id !== id));
  } catch (err) {
    console.error(err);
    alert("Error deleting client.");
  }
};



  const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Client List</h1>
      <table className="min-w-full border">
       <thead>
  <tr className="bg-gray-800 text-left">
    <th className="p-2">Name</th>
    <th className="p-2">Email</th>
    <th className="p-2">Document</th>
    <th className="p-2">Birth Date</th>
    <th className="p-2">Profession</th>
    <th className="p-2">Address</th>
    <th className="p-2">Actions</th>
  </tr>
</thead>
<tbody>
  {clients.map((client) => (
    <tr key={client.id} className="border-t">
      <td className="p-2">
        {editId === client.id ? (
          <input
            name="full_name"
            value={editedClient.full_name || ""}
            onChange={handleChange}
            className="border p-1"
          />
        ) : (
          client.full_name
        )}
      </td>
      <td className="p-2">
        {editId === client.id ? (
          <input
            name="email"
            value={editedClient.email || ""}
            onChange={handleChange}
            className="border p-1"
          />
        ) : (
          client.email
        )}
      </td>
      <td className="p-2">
        {editId === client.id ? (
          <input
            name="document"
            value={editedClient.document || ""}
            onChange={handleChange}
            className="border p-1"
          />
        ) : (
          client.document
        )}
      </td>
      <td className="p-2">
  {editId === client.id ? (
    <input
      type="date"
      name="birth_date"
      value={editedClient.birth_date || ""}
      onChange={handleChange}
      className="border p-1"
    />
  ) : (
    formatDate(client.birth_date)
  )}
</td>
      <td className="p-2">
        {editId === client.id ? (
          <input
            name="profession"
            value={editedClient.profession || ""}
            onChange={handleChange}
            className="border p-1"
          />
        ) : (
          client.profession
        )}
      </td>
      <td className="p-2">
        {editId === client.id ? (
          <input
            name="address"
            value={editedClient.address || ""}
            onChange={handleChange}
            className="border p-1"
          />
        ) : (
          client.address
        )}
      </td>
      <td className="p-2 space-x-2">
  {editId === client.id ? (
    <button
      onClick={handleSave}
      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 cursor-pointer"
    >
      💾 Save
    </button>
  ) : (
    <>
      <button
        onClick={() => handleEdit(client)}
        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
      >
        ✏️ Edit
      </button>
      <button
        onClick={() => handleDelete(client.id)}
        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer"
      >
        🗑️ Delete
      </button>
    </>
  )}
</td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  )
}