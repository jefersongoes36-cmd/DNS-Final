import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { User, SupportedLanguage, TimeRecord } from "../types";
import { TRANSLATIONS } from "../constants";
import { generateBackupFile } from "../utils/helpers";
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Clock,
  Database,
  ShieldCheck
} from "lucide-react";

interface Props {
  users: User[];
  onAddUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  lang: SupportedLanguage;
  records: TimeRecord[];
}

const AdminDashboard: React.FC<Props> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  lang,
  records
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    username: "",
    password: "",
    role: "employee",
    hourlyRate: "",
    currency: "EUR",
    country: "PT",
    isActive: true
  });

  const t = TRANSLATIONS[lang];

  /* =========================
     🔹 BUSCAR USERS DO BACKEND
     ========================= */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users`);
        res.data.forEach((u: User) => onAddUser(u));
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNew = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      username: "",
      password: "123",
      role: "employee",
      hourlyRate: "",
      currency: "EUR",
      country: "PT",
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setFormData(user);
    setIsModalOpen(true);
  };

  /* =========================
     🔹 CRIAR / EDITAR USER
     ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const res = await axios.put(
          `${API_URL}/api/users/${formData.id}`,
          formData
        );
        onEditUser(res.data);
      } else {
        const res = await axios.post(`${API_URL}/api/users`, {
          username: formData.username,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          currency: formData.currency,
          country: formData.country,
          hourlyRate: Number(formData.hourlyRate) || 0
        });
        onAddUser(res.data);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      alert("Erro ao salvar usuário");
    }
  };

  /* =========================
     🔹 DELETE USER
     ========================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Deseja apagar este usuário?")) return;

    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      onDeleteUser(id);
    } catch (err) {
      console.error("Erro ao apagar usuário:", err);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black">{t.adminPanel}</h2>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <UserPlus size={16} /> Novo
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
        <input
          className="w-full pl-10 p-3 border rounded-lg"
          placeholder="Pesquisar usuário"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nome</th>
            <th className="p-2">Username</th>
            <th className="p-2">Role</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">@{u.username}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => handleEdit(u)}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(u.id)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl space-y-4 w-full max-w-md"
          >
            <h3 className="font-black">
              {isEditing ? "Editar usuário" : "Novo usuário"}
            </h3>

            <input
              required
              placeholder="Nome"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <input
              required
              placeholder="Username"
              className="w-full p-2 border rounded"
              value={formData.username}
              onChange={e =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            {!isEditing && (
              <input
                required
                placeholder="Senha"
                type="password"
                className="w-full p-2 border rounded"
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            )}

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              Salvar
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full text-gray-400"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
