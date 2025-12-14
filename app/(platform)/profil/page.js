"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile/get", { credentials: "include" });

        if (res.status === 401) {
          router.replace("/auth/login");
          return;
        }

        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Erreur chargement profil:", err);
        router.replace("/auth/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleUpload = async () => {
    if (!file) return alert("Choisis une image d'abord.");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/profile/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("Photo mise à jour !");
      setUser({ ...user, photo: data.imageUrl });
    } else {
      alert("Erreur : " + data.error);
    }
  };

  if (!user) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        Profil de {user.firstName} {user.lastName}
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.photo || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <p className="font-medium">{user.firstName} {user.lastName}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Mettre à jour la photo
        </button>
      </div>
    </div>
  );
}
