// app/register-client/page.tsx
"use client";

import { useState } from "react";

type Client = {
  fullName: string;
  email: string;
  birthDate: string;
  profession: string;
  address: string;
  document: string; // ⬅️ novo campo
};

export default function RegisterClientPage() {
  const [client, setClient] = useState<Client>({
    fullName: "",
    email: "",
    birthDate: "",
    profession: "",
    address: "",
    document: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting client:", client);

    try {
      const res = await fetch("http://localhost:3001/api/clients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(client),
});

const responseText = await res.text(); // 👈 captura a resposta bruta

console.log("Status:", res.status);
console.log("Resposta do servidor:", responseText);

if (!res.ok) throw new Error("Failed to register client");
      alert("Client registered successfully!");
      setClient({
        fullName: "",
        email: "",
        birthDate: "",
        profession: "",
        address: "",
        document: "",
      });
    } catch (err) {
      alert("Error registering client.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-start mt-20">
      <div className="w-full max-w-screen-md px-4">
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Nuovo Cliente
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={client.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="document"
              placeholder="Document "
              value={client.document}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={client.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              name="birthDate"
              value={client.birthDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="profession"
              placeholder="Profession"
              value={client.profession}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={client.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              type="submit"
              className="w-full bg-black text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
